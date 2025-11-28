-- Create products table with comprehensive metadata for B2B polymer catalog
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  grade TEXT,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  
  -- Technical specifications
  recycled BOOLEAN DEFAULT false,
  color TEXT,
  mfi TEXT, -- Melt Flow Index
  density TEXT,
  certifications TEXT[], -- Array of certifications (e.g., ISO, FDA)
  
  -- Metadata
  applications TEXT[], -- Array of application areas
  features TEXT[], -- Key features/benefits
  in_stock BOOLEAN DEFAULT true,
  
  -- Media and documents
  image_url TEXT,
  gallery_images TEXT[], -- Additional product images
  tds_url TEXT, -- Technical Data Sheet PDF
  sds_url TEXT, -- Safety Data Sheet PDF
  certification_docs JSONB, -- {name: string, url: string}[]
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(type, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'C')
  ) STORED
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_products_subcategory ON public.products(subcategory);
CREATE INDEX idx_products_recycled ON public.products(recycled);
CREATE INDEX idx_products_in_stock ON public.products(in_stock);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_search ON public.products USING GIN(search_vector);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access (B2B catalog is public)
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();