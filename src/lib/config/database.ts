
export type DataSource = 'supabase' | 'postgres';

// Interface para configuração de cada tabela/modelo
export interface TableConfig {
  name: string;
  source: DataSource;
  primaryKey: string;
}

// Configuração de quais tabelas vão para qual fonte de dados
export const tableConfig: Record<string, TableConfig> = {
  // Tabelas gerenciadas pelo Supabase (autenticação, baixo volume)
  profiles: {
    name: 'profiles',
    source: 'supabase',
    primaryKey: 'id'
  },
  system_admins: {
    name: 'system_admins',
    source: 'supabase',
    primaryKey: 'id'
  },
  staff: {
    name: 'staff',
    source: 'supabase',
    primaryKey: 'id'
  },
  stores: {
    name: 'stores',
    source: 'supabase',
    primaryKey: 'id'
  },
  positions: {
    name: 'positions',
    source: 'supabase',
    primaryKey: 'id'
  },
  store_settings: {
    name: 'store_settings',
    source: 'supabase',
    primaryKey: 'id'
  },
  
  // Tabelas que serão migradas para PostgreSQL direto (alto volume)
  products: {
    name: 'products',
    source: 'postgres',
    primaryKey: 'id'
  },
  sales: {
    name: 'sales',
    source: 'postgres',
    primaryKey: 'id'
  },
  customers: {
    name: 'customers',
    source: 'postgres',
    primaryKey: 'id'
  },
  orders: {
    name: 'orders',
    source: 'postgres',
    primaryKey: 'id'
  },
  reconciliation_jobs: {
    name: 'reconciliation_jobs',
    source: 'postgres',
    primaryKey: 'id'
  },
  reconciliation_items: {
    name: 'reconciliation_items',
    source: 'postgres',
    primaryKey: 'id'
  }
};

// Função auxiliar para determinar a fonte de dados de uma tabela
export function getDataSource(tableName: string): DataSource {
  return tableConfig[tableName]?.source || 'supabase';
}
