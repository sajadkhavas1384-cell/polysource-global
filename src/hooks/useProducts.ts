import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface ProductFilters {
  search?: string;
  category?: string;
  type?: string;
  recycled?: boolean;
  inStock?: boolean;
}

export type Product = Database["public"]["Tables"]["products"]["Row"];

interface UseProductsOptions {
  filters?: ProductFilters;
  page?: number;
  pageSize?: number;
}

export function useProducts({ filters = {}, page = 1, pageSize = 12 }: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ["products", filters, page, pageSize],
    queryFn: async () => {
      let query = supabase.from("products").select("*", { count: "exact" });

      // Apply filters
      if (filters.search) {
        query = query.textSearch("search_vector", filters.search, {
          type: "websearch",
          config: "english",
        });
      }

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.type) {
        query = query.eq("type", filters.type);
      }

      if (filters.recycled !== undefined) {
        query = query.eq("recycled", filters.recycled);
      }

      if (filters.inStock !== undefined) {
        query = query.eq("in_stock", filters.inStock);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      // Order by name
      query = query.order("name", { ascending: true });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        products: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Product not found");

      return data;
    },
    enabled: !!slug,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .order("category");

      if (error) throw error;

      // Get unique categories
      const categories = [...new Set((data || []).map((item) => item.category))];
      return categories;
    },
  });
}

export function useProductTypes() {
  return useQuery({
    queryKey: ["product-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("type")
        .order("type");

      if (error) throw error;

      // Get unique types
      const types = [...new Set((data || []).map((item) => item.type))];
      return types;
    },
  });
}
