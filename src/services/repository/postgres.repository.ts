
import { pool, query, transaction } from "@/lib/db/postgres";
import { BaseRepository, QueryOptions, Repository } from "./base.repository";
import { tableConfig } from "@/lib/config/database";

// Implementação do repositório para PostgreSQL
export class PostgresRepository<T> extends BaseRepository<T> {
  private primaryKey: string;

  constructor(tableName: string) {
    super(tableName);
    this.primaryKey = tableConfig[tableName]?.primaryKey || 'id';
  }

  async findAll(options?: QueryOptions): Promise<T[]> {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    let paramIndex = 1;

    // Adicionar cláusula WHERE se houver filtros
    if (options?.filter && Object.keys(options.filter).length > 0) {
      const whereConditions = Object.entries(options.filter).map(([key, value]) => {
        params.push(value);
        return `${key} = $${paramIndex++}`;
      });
      
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    // Adicionar ordenação
    if (options?.orderBy) {
      sql += ` ORDER BY ${options.orderBy} ${options.orderDirection || 'ASC'}`;
    }

    // Adicionar limit e offset
    if (options?.limit) {
      sql += ` LIMIT $${paramIndex++}`;
      params.push(options.limit);
    }

    if (options?.offset) {
      sql += ` OFFSET $${paramIndex++}`;
      params.push(options.offset);
    }

    return await query<T>(sql, params);
  }

  async findById(id: string): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1 LIMIT 1`;
    const result = await query<T>(sql, [id]);
    return result.length > 0 ? result[0] : null;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    if (Object.keys(filter).length === 0) {
      throw new Error("Filter cannot be empty for findOne operation");
    }

    const conditions = Object.keys(filter).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(filter);
    
    const sql = `SELECT * FROM ${this.tableName} WHERE ${conditions.join(' AND ')} LIMIT 1`;
    const result = await query<T>(sql, values);
    
    return result.length > 0 ? result[0] : null;
  }

  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`);
    
    const sql = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await query<T>(sql, values);
    
    if (result.length === 0) {
      throw new Error(`Failed to create record in ${this.tableName}`);
    }
    
    return result[0];
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    
    const sql = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE ${this.primaryKey} = $${keys.length + 1}
      RETURNING *
    `;
    
    const result = await query<T>(sql, [...values, id]);
    
    if (result.length === 0) {
      throw new Error(`Record with ${this.primaryKey} = ${id} not found in ${this.tableName}`);
    }
    
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
    const result = await query<T>(sql, [id]);
    return true;
  }

  async count(filter?: Partial<T>): Promise<number> {
    let sql = `SELECT COUNT(*) FROM ${this.tableName}`;
    const params: any[] = [];
    
    if (filter && Object.keys(filter).length > 0) {
      const conditions = Object.keys(filter).map((key, index) => `${key} = $${index + 1}`);
      params.push(...Object.values(filter));
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    const result = await query<{count: string}>(sql, params);
    return parseInt(result[0].count);
  }
}
