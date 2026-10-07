-- ==========================================================
-- CROPCARE - SMART FARMING DECISION ASSISTANT
-- Supabase Database SQL Schema & Tables Setup (No Demo Data)
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Fields Table
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    area_acres NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    soil_type VARCHAR(100) NOT NULL DEFAULT 'Clay',
    crop_stage VARCHAR(100) NOT NULL DEFAULT 'Vegetative Growth',
    location VARCHAR(255) DEFAULT 'Tadikalapudi, Andhra Pradesh',
    soil_moisture NUMERIC(5,2) DEFAULT 30.0,
    temperature NUMERIC(5,2) DEFAULT 32.0,
    humidity NUMERIC(5,2) DEFAULT 45.0,
    rain_probability NUMERIC(5,2) DEFAULT 10.0,
    water_available_litres NUMERIC(10,2) DEFAULT 5000.0,
    status VARCHAR(50) DEFAULT 'Healthy',
    last_irrigated_at TIMESTAMPTZ,
    sensor_status VARCHAR(50) DEFAULT 'Online',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sensor Readings (Telemetry Stream)
CREATE TABLE IF NOT EXISTS public.sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE,
    soil_moisture NUMERIC(5,2) NOT NULL,
    temperature NUMERIC(5,2) NOT NULL,
    humidity NUMERIC(5,2) NOT NULL,
    rain_probability NUMERIC(5,2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Irrigation History Table
CREATE TABLE IF NOT EXISTS public.irrigation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
    field_name VARCHAR(255) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    decision VARCHAR(50) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    water_applied_litres NUMERIC(10,2) NOT NULL,
    trigger_type VARCHAR(100) DEFAULT 'Decision Engine Recommendation',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Recommendations Table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE,
    decision VARCHAR(50) NOT NULL,
    duration_minutes VARCHAR(50),
    confidence VARCHAR(50) DEFAULT 'High',
    reasons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Crop Health AI Analysis History Table
CREATE TABLE IF NOT EXISTS public.crop_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
    crop_name VARCHAR(100) NOT NULL,
    image_url TEXT,
    condition VARCHAR(100) NOT NULL,
    confidence_percent NUMERIC(5,2) NOT NULL,
    symptoms JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables direct read/write access for your web app
-- ==========================================================

ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_analysis ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for CropCare app
CREATE POLICY "Allow public read-write on fields" ON public.fields FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on sensor_readings" ON public.sensor_readings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on irrigation_history" ON public.irrigation_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on recommendations" ON public.recommendations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on crop_analysis" ON public.crop_analysis FOR ALL USING (true) WITH CHECK (true);
