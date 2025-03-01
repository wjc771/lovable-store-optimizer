
import { getDataSource } from "@/lib/config/database";
import { Repository } from "./base.repository";
import { PostgresRepository } from "./postgres.repository";
import { SupabaseRepository } from "./supabase.repository";

// Factory para criar o repositório apropriado baseado na configuração
export function createRepository<T>(tableName: string): Repository<T> {
  const source = getDataSource(tableName);
  
  switch (source) {
    case 'postgres':
      return new PostgresRepository<T>(tableName);
    case 'supabase':
      return new SupabaseRepository<T>(tableName);
    default:
      throw new Error(`Unknown data source: ${source}`);
  }
}
