import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  display_order: number;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  image: string;
  display_order: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function fetchSubcategories(categoryId?: string): Promise<Subcategory[]> {
  let query = supabase.from('subcategories').select('*').order('display_order', { ascending: true });
  if (categoryId) query = query.eq('category_id', categoryId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Subcategory[];
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
