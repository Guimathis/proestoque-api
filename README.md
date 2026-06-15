# ProEstoque API

API REST para o sistema de gerenciamento de estoque **ProEstoque**, construída com Node.js, Express, Prisma e TypeScript.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm (incluso com o Node.js)

> Em produção é necessário um banco **PostgreSQL**. Em desenvolvimento, o projeto usa **SQLite** (sem instalação extra).

## 🚀 Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd proestoque-api

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves JWT
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Exemplo (Dev) |
|---|---|---|
| `DATABASE_URL` | URL de conexão com o banco | `file:./dev.db` |
| `PORT` | Porta do servidor | `3333` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `JWT_SECRET` | Chave secreta do JWT | *(gere uma chave forte)* |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `7d` |
| `JWT_REFRESH_SECRET` | Chave secreta do refresh token | *(gere uma chave forte)* |
| `JWT_REFRESH_EXPIRES_IN` | Tempo de expiração do refresh | `30d` |

## 🗄️ Banco de Dados

### Desenvolvimento (SQLite)

```bash
# Criar/atualizar tabelas com migrations
npm run db:migrate

# Popular o banco com dados iniciais
npm run db:seed

# Abrir o Prisma Studio (interface visual do banco)
npm run db:studio
```

### Produção (PostgreSQL)

O schema Prisma usa SQLite por padrão. O script `build:prod` troca automaticamente para PostgreSQL antes de compilar:

```bash
npm run build:prod
```

## ▶️ Rodando o projeto

### Desenvolvimento

```bash
npm run dev
```

O servidor inicia em `http://localhost:3333` com hot-reload via `ts-node-dev`.

### Produção

```bash
npm run build:prod   # Troca para PostgreSQL + gera Prisma Client + compila TS
npm start            # Roda o servidor compilado
```

## 📡 Endpoints da API

Todas as rotas ficam sob o prefixo `/api`.

### Healthcheck

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Verifica se a API está online |

### Autenticação (`/api/auth`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/cadastro` | Criar nova conta |
| `POST` | `/api/auth/login` | Autenticar e receber tokens |
| `POST` | `/api/auth/refresh` | Renovar token de acesso |

### Produtos (`/api/produtos`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/produtos` | Listar todos os produtos |
| `GET` | `/api/produtos/:id` | Buscar produto por ID |
| `POST` | `/api/produtos` | Criar novo produto |
| `PUT` | `/api/produtos/:id` | Atualizar produto |
| `DELETE` | `/api/produtos/:id` | Excluir produto |

### Categorias (`/api/categorias`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/categorias` | Listar todas as categorias |

> As rotas de produtos e categorias requerem autenticação via header `Authorization: Bearer <token>`.

## 📦 Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor em modo desenvolvimento (hot-reload) |
| `npm run build` | Compila TypeScript para JavaScript (SQLite) |
| `npm run build:prod` | Troca provider para PostgreSQL + gera Prisma + compila TS |
| `npm start` | Inicia o servidor compilado (produção) |
| `npm run db:migrate` | Cria/aplica migrations em desenvolvimento |
| `npm run db:deploy` | Aplica migrations em produção (sem criar novas) |
| `npm run db:seed` | Popula o banco com dados iniciais |
| `npm run db:studio` | Abre o Prisma Studio |

## 🚂 Deploy na Railway

1. Crie um novo projeto na [Railway](https://railway.app/)
2. Adicione um serviço **PostgreSQL**
3. Conecte o repositório Git
4. Configure as variáveis de ambiente:
   - `DATABASE_URL` → copie a URL do PostgreSQL da Railway
   - `JWT_SECRET` → uma chave secreta forte
   - `JWT_REFRESH_SECRET` → outra chave secreta forte
   - `NODE_ENV` → `production`
5. Configure os comandos:
   - **Build Command**: `npm run build:prod`
   - **Start Command**: `npm start`

## 🏗️ Estrutura do projeto

```
proestoque-api/
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── migrations/        # Histórico de migrations
├── src/
│   ├── app.ts             # Configuração do Express
│   ├── server.ts          # Ponto de entrada (inicia o servidor)
│   ├── config.ts          # Variáveis de ambiente tipadas
│   ├── controllers/       # Lógica dos endpoints
│   ├── middlewares/        # Auth, validação, error handler
│   ├── routes/            # Definição das rotas
│   ├── schemas/           # Schemas de validação (Zod)
│   └── prisma/            # Client e seed do Prisma
├── .env                   # Variáveis de ambiente (não commitado)
├── .env.example           # Exemplo das variáveis
├── package.json
└── tsconfig.json
```

## 🛠️ Tecnologias

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **ORM**: Prisma
- **Banco de dados**: SQLite (dev) / PostgreSQL (prod)
- **Autenticação**: JWT (access + refresh tokens)
- **Validação**: Zod
- **Senhas**: bcrypt
