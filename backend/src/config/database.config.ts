import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'primeone_user',
  password: process.env.DB_PASSWORD || 'securepassword123',
  name: process.env.DB_NAME || 'primeone',
  url:
    process.env.DATABASE_URL ||
    'postgresql://primeone_user:securepassword123@localhost:5432/primeone',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
  idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30', 10),
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '5', 10),
}));
