import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || '3306';
const dbName = process.env.DB_NAME || 'medixpro';

// Dynamically construct and set DATABASE_URL for Prisma
process.env.DATABASE_URL = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const items = await prisma.$queryRaw`SELECT id, name, category, initialQuantity, reorderLevel, status FROM inventory_items`;
    console.log('--- ALL INVENTORY ITEMS IN DATABASE ---');
    console.log(items);
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
