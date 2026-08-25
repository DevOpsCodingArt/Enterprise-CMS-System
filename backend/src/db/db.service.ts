import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DbService.name);
  private client: postgres.Sql;
  public db: PostgresJsDatabase<typeof schema>;

  constructor(private readonly configService: ConfigService) {
    const connectionString =
      this.configService.get<string>('DATABASE_URL') ||
      'postgresql://primeone_user:securepassword123@localhost:5432/primeone';

    this.client = postgres(connectionString, {
      max: 20,
      idle_timeout: 30,
      connect_timeout: 5,
      onnotice: () => {}, // suppress notice noise
    });

    this.db = drizzle(this.client, { schema });
  }

  async onModuleInit() {
    try {
      // Test the database connection
      await this.client`SELECT 1`;
      this.logger.log(' Connected to PostgreSQL database successfully.');
    } catch (error: any) {
      this.logger.warn(`⚠️ PostgreSQL connection attempt: ${error.message}.`);
      this.logger.warn('Ensure PostgreSQL container is running via podman-compose up -d');
    }
  }

  async onModuleDestroy() {
    await this.client.end({ timeout: 5 });
  }

  /**
   * Helper to set PostgreSQL Row-Level Security tenant context variable
   * for tenant isolation.
   */
  async setTenantContext(companyId: string) {
    try {
      await this.client`SET LOCAL app.current_company_id = ${companyId}`;
    } catch (err: any) {
      this.logger.error(`Failed to set tenant context: ${err.message}`);
    }
  }
}
