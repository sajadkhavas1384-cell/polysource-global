import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample products data - migrate from existing TypeScript data
const sampleProducts = [
  {
    name: "LDPE Film Grade",
    slug: "ldpe-film-grade",
    grade: "LD2420H",
    type: "LDPE",
    category: "Petrochemical Raw Materials",
    subcategory: "Low Density Polyethylene",
    description: "High-quality LDPE for blown and cast film applications",
    recycled: false,
    color: "Natural",
    mfi: "2.0",
    density: "0.920 g/cm³",
    certifications: ["ISO 9001", "FDA Approved"],
    applications: ["Packaging Films", "Agricultural Films", "Industrial Wraps"],
    features: ["Excellent clarity", "High tensile strength", "Good heat sealability"],
    in_stock: true,
    image_url: "/images/hero-products-pellets.jpg"
  },
  {
    name: "Recycled PP Granules",
    slug: "recycled-pp-granules",
    grade: "RPP-300",
    type: "rPP",
    category: "Recycled Materials",
    subcategory: "Recycled Polypropylene",
    description: "Post-consumer recycled polypropylene granules for injection molding",
    recycled: true,
    color: "Grey",
    mfi: "10.0",
    density: "0.905 g/cm³",
    certifications: ["ISO 14001", "GRS Certified"],
    applications: ["Automotive Parts", "Household Items", "Industrial Components"],
    features: ["Sustainable", "Cost-effective", "Consistent quality"],
    in_stock: true,
    image_url: "/images/hero-products-pellets.jpg"
  },
  {
    name: "HDPE Blow Molding Grade",
    slug: "hdpe-blow-molding",
    grade: "HD5502BN",
    type: "HDPE",
    category: "Petrochemical Raw Materials",
    subcategory: "High Density Polyethylene",
    description: "Blow molding grade HDPE for containers and bottles",
    recycled: false,
    color: "Natural",
    mfi: "0.3",
    density: "0.955 g/cm³",
    certifications: ["ISO 9001", "FDA Approved"],
    applications: ["Bottles", "Containers", "Drums"],
    features: ["High stiffness", "Excellent processability", "Good environmental stress crack resistance"],
    in_stock: true,
    image_url: "/images/hero-products-pellets.jpg"
  },
  {
    name: "Black Masterbatch",
    slug: "black-masterbatch",
    grade: "BMB-4500",
    type: "Masterbatch",
    category: "Compounds & Masterbatches",
    subcategory: "Color Masterbatch",
    description: "High concentration carbon black masterbatch for PE applications",
    recycled: false,
    color: "Black",
    mfi: "5.0",
    density: "1.10 g/cm³",
    certifications: ["REACH Compliant"],
    applications: ["Film Extrusion", "Injection Molding", "Pipe Manufacturing"],
    features: ["High UV protection", "Excellent dispersion", "Cost-effective"],
    in_stock: true,
    image_url: "/images/hero-products-pellets.jpg"
  }
];

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting product seed...');

    // Insert products
    const { data, error } = await supabase
      .from('products')
      .upsert(sampleProducts, { 
        onConflict: 'slug',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('Error seeding products:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data?.length || 0} products`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: data?.length || 0,
        message: 'Products seeded successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Seed function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
