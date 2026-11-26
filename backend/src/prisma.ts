import { PrismaClient } from '@prisma/client';

/**
 * Single shared PrismaClient. Every `new PrismaClient()` opens its own
 * connection pool, so creating one per route file multiplies MySQL
 * connections. Import this instead.
 */
const prisma = new PrismaClient();

export default prisma;
