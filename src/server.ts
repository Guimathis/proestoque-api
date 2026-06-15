import "dotenv/config"; // Carrega as variáveis do .env ANTES de qualquer import
import { app } from "./app";
import { prisma } from "./prisma/client";

const PORT = process.env.PORT ?? 3333;

// Testa a conexão com o banco antes de iniciar
async function iniciar() {
    try {
        await prisma.$connect();
        console.log("✅ Banco de dados conectado");

        app.listen(Number(PORT), "0.0.0.0", () => {
            console.log(`🚀 ProEstoque API rodando em http://0.0.0.0:${PORT} (acessível na rede)`);
            console.log(`📊 Prisma Studio: npx prisma studio`);
        });
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco:", error);
        process.exit(1);
    }
}

iniciar();