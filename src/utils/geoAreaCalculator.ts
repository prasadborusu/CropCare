export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface FarmAreaCalculation {
  acres: number;
  hectares: number;
  sqMeters: number;
  sqFeet: number;
  cents: number; // 1 Acre = 100 Cents
  gunthas: number; // 1 Acre = 40 Gunthas
  perimeterMeters: number;
  perimeterFeet: number;
  center: LatLngPoint;
}

const EARTH_RADIUS = 6378137; // meters (WGS84)

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates the exact geodesic spherical polygon area of farm boundaries in Acres, Hectares, and Sq Meters.
 */
export function calculatePolygonArea(coords: LatLngPoint[]): FarmAreaCalculation {
  if (coords.length < 3) {
    const defaultCenter = coords[0] || { lat: 16.96, lng: 81.12 };
    return {
      acres: 0,
      hectares: 0,
      sqMeters: 0,
      sqFeet: 0,
      cents: 0,
      gunthas: 0,
      perimeterMeters: 0,
      perimeterFeet: 0,
      center: defaultCenter,
    };
  }

  let totalArea = 0;
  let totalPerimeter = 0;

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];

    // Spherical excess area formula
    const lat1 = toRadians(p1.lat);
    const lat2 = toRadians(p2.lat);
    const dLng = toRadians(p2.lng - p1.lng);

    totalArea += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));

    // Haversine perimeter distance
    const dLat = lat2 - lat1;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalPerimeter += EARTH_RADIUS * c;
  }

  totalArea = Math.abs((totalArea * EARTH_RADIUS * EARTH_RADIUS) / 2);

  const sqMeters = parseFloat(totalArea.toFixed(2));
  const acres = parseFloat((sqMeters / 4046.8564224).toFixed(3));
  const hectares = parseFloat((sqMeters / 10000).toFixed(3));
  const sqFeet = Math.round(sqMeters * 10.7639);
  const cents = parseFloat((acres * 100).toFixed(2));
  const gunthas = parseFloat((acres * 40).toFixed(2));

  // Compute centroid
  const sumLat = coords.reduce((sum, p) => sum + p.lat, 0);
  const sumLng = coords.reduce((sum, p) => sum + p.lng, 0);
  const center: LatLngPoint = {
    lat: parseFloat((sumLat / coords.length).toFixed(6)),
    lng: parseFloat((sumLng / coords.length).toFixed(6)),
  };

  return {
    acres,
    hectares,
    sqMeters,
    sqFeet,
    cents,
    gunthas,
    perimeterMeters: Math.round(totalPerimeter),
    perimeterFeet: Math.round(totalPerimeter * 3.28084),
    center,
  };
}
