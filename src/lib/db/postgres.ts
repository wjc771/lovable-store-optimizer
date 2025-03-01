
import { Pool, PoolClient } from 'pg';

// Configuração da conexão PostgreSQL
// Estas configurações devem ser definidas por variáveis de ambiente em produção
const config = {
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'katena',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // tamanho máximo do pool de conexões
  idleTimeoutMillis: 30000, // tempo máximo que uma conexão pode ficar ociosa
  connectionTimeoutMillis: 2000, // tempo máximo para conectar
};

// Criar pool de conexões PostgreSQL
const pool = new Pool(config);

// Monitorar eventos do pool para debug
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Execute uma query SQL e retorne os resultados
 * @param text - Query SQL
 * @param params - Parâmetros para a query
 * @returns Resultado da query
 */
export async function query<T>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

/**
 * Execute uma transação SQL
 * @param callback - Função que recebe o cliente e executa as operações na transação
 * @returns Resultado da transação
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Exporta o pool para casos onde acesso direto é necessário
export { pool };
