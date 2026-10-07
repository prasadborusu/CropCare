/**
 * Location Service for CropCare
 * Provides ultra-fast, resilient geolocation with:
 * 1. Fast browser GPS query with progressive timeout (no 10-second freeze)
 * 2. Instant IP-based network location fallback (<500ms)
 * 3. Accurate permission status inspection
 * 4. Automatic caching and reverse geocoding
 */

export interface LocationResult {
  lat: number;
  lng: number;
  accuracy: number;
  placeName?: string;
  source: 'gps' | 'network' | 'cache';
  permissionStatus?: 'granted' | 'prompt' | 'denied' | 'unsupported';
}

const CACHE_KEY = 'cropcare_cached_location_coords';

export class LocationService {
  /**
   * Get permission state if supported by the browser
   */
  static async getPermissionState(): Promise<'granted' | 'prompt' | 'denied' | 'unsupported'> {
    if (typeof navigator === 'undefined' || !navigator.permissions || !navigator.permissions.query) {
      return 'unsupported';
    }
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return status.state; // 'granted' | 'prompt' | 'denied'
    } catch {
      return 'unsupported';
    }
  }

  /**
   * Fast IP-based network location fallback (requires no permissions, resolves in <500ms)
   */
  static async getNetworkLocation(): Promise<LocationResult | null> {
    try {
      const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          const lat = parseFloat(data.latitude);
          const lng = parseFloat(data.longitude);
          const place = data.locality || data.city || data.principalSubdivision || 'Farm Location';
          const state = data.principalSubdivision || data.countryName || '';
          const placeName = state && place !== state ? `${place}, ${state}` : place;

          const result: LocationResult = {
            lat,
            lng,
            accuracy: 2500, // approximate city-level accuracy in meters
            placeName,
            source: 'network',
          };

          // Cache for offline / instant load
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(result));
          } catch {}

          return result;
        }
      }
    } catch (e) {
      console.warn('Network location lookup fallback failed:', e);
    }
    return null;
  }

  /**
   * Get cached location if available
   */
  static getCachedLocation(): LocationResult | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          return { ...parsed, source: 'cache' };
        }
      }
    } catch {}
    return null;
  }

  /**
   * Acquire user location quickly.
   * If GPS is slow or denied, seamlessly falls back to network IP location so the UI never hangs.
   */
  static async getCurrentLocation(options?: {
    enableHighAccuracy?: boolean;
    timeoutMs?: number;
    fallbackToNetwork?: boolean;
  }): Promise<LocationResult> {
    const {
      enableHighAccuracy = false,
      timeoutMs = 4000,
      fallbackToNetwork = true,
    } = options || {};

    const permState = await this.getPermissionState();

    // If geolocation API is missing or explicitly denied, fallback to network immediately without waiting
    if (!navigator.geolocation || permState === 'denied') {
      if (fallbackToNetwork) {
        const netLoc = await this.getNetworkLocation();
        if (netLoc) {
          return { ...netLoc, permissionStatus: permState };
        }
      }
      const cached = this.getCachedLocation();
      if (cached) return { ...cached, permissionStatus: permState };

      // Default India agricultural heartland fallback coordinates (Andhra/Telangana belt)
      return {
        lat: 17.52,
        lng: 82.98,
        accuracy: 5000,
        placeName: 'Rambilli, Andhra Pradesh',
        source: 'network',
        permissionStatus: permState,
      };
    }

    // Attempt GPS with quick progressive timeout
    return new Promise<LocationResult>((resolve) => {
      let isResolved = false;

      const fallbackTimer = setTimeout(async () => {
        if (!isResolved) {
          isResolved = true;
          if (fallbackToNetwork) {
            const netLoc = await LocationService.getNetworkLocation();
            if (netLoc) {
              resolve({ ...netLoc, permissionStatus: permState });
              return;
            }
          }
          const cached = LocationService.getCachedLocation();
          if (cached) {
            resolve({ ...cached, permissionStatus: permState });
            return;
          }
          resolve({
            lat: 17.52,
            lng: 82.98,
            accuracy: 5000,
            placeName: 'Rambilli, Andhra Pradesh',
            source: 'network',
            permissionStatus: permState,
          });
        }
      }, timeoutMs);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (isResolved) return;
          isResolved = true;
          clearTimeout(fallbackTimer);

          const result: LocationResult = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            source: 'gps',
            permissionStatus: 'granted',
          };

          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(result));
          } catch {}

          resolve(result);
        },
        async (err) => {
          if (isResolved) return;
          isResolved = true;
          clearTimeout(fallbackTimer);

          let updatedPermState: 'denied' | 'prompt' | 'unsupported' = 'prompt';
          if (err.code === err.PERMISSION_DENIED) {
            updatedPermState = 'denied';
          }

          if (fallbackToNetwork) {
            const netLoc = await LocationService.getNetworkLocation();
            if (netLoc) {
              resolve({ ...netLoc, permissionStatus: updatedPermState });
              return;
            }
          }

          const cached = LocationService.getCachedLocation();
          if (cached) {
            resolve({ ...cached, permissionStatus: updatedPermState });
            return;
          }

          resolve({
            lat: 17.52,
            lng: 82.98,
            accuracy: 5000,
            placeName: 'Rambilli, Andhra Pradesh',
            source: 'network',
            permissionStatus: updatedPermState,
          });
        },
        {
          enableHighAccuracy,
          timeout: timeoutMs,
          maximumAge: 60000, // 1 minute cache allows instant return if already queried
        }
      );
    });
  }
}
