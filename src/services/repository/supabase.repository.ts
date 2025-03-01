
import { supabase } from "@/lib/db/supabase";
import { BaseRepository, QueryOptions, Repository } from "./base.repository";
import { tableConfig } from "@/lib/config/database";

// Implementação do repositório para Supabase
export class SupabaseRepository<T> extends BaseRepository<T> {
  private primaryKey: string;

  constructor(tableName: string) {
    super(tableName);
    this.primaryKey = tableConfig[tableName]?.primaryKey || 'id';
  }

  async findAll(options?: QueryOptions): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');

    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.orderDirection !== 'desc',
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching from ${this.tableName}:`, error);
      throw error;
    }

    return data as unknown as T[];
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq(this.primaryKey, id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error(`Error fetching ${this.tableName} by id:`, error);
      throw error;
    }

    return data as unknown as T;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    let query = supabase.from(this.tableName).select('*');

    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.limit(1).maybeSingle();

    if (error) {
      console.error(`Error finding one in ${this.tableName}:`, error);
      throw error;
    }

    return data as unknown as T;
  }

  async create(data: Partial<T>): Promise<T> {
    const { data: newData, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error(`Error creating in ${this.tableName}:`, error);
      throw error;
    }

    return newData as unknown as T;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: updatedData, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq(this.primaryKey, id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating in ${this.tableName}:`, error);
      throw error;
    }

    return updatedData as unknown as T;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq(this.primaryKey, id);

    if (error) {
      console.error(`Error deleting from ${this.tableName}:`, error);
      throw error;
    }

    return true;
  }

  async count(filter?: Partial<T>): Promise<number> {
    let query = supabase.from(this.tableName).select('*', { count: 'exact', head: true });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { count, error } = await query;

    if (error) {
      console.error(`Error counting in ${this.tableName}:`, error);
      throw error;
    }

    return count || 0;
  }
}
