/**
 * Prebuild: detecta a DATABASE_URL e ajusta o provider no schema.prisma.
 * - Se a URL começa com "postgresql" → troca para provider = "postgresql"
 * - Caso contrário → mantém provider = "sqlite"
 *
 * Roda automaticamente antes do "npm run build" (via script "prebuild" do npm).
 */
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const databaseUrl = process.env.DATABASE_URL || '';

const isPostgres = databaseUrl.startsWith('postgresql');
const provider = isPostgres ? 'postgresql' : 'sqlite';

let schema = fs.readFileSync(schemaPath, 'utf8');
schema = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
);
fs.writeFileSync(schemaPath, schema);

console.log(`✅ Prisma provider → ${provider}`);
