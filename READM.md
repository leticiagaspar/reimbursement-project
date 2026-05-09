# ReembolsaAI

> Sistema fullstack para controle de solicitações de reembolso - construído com Node.js, Express, TypeScript, Prisma, React e JWT.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Tested_with-Jest-C21325?style=flat-square&logo=jest&logoColor=white)

---

## Índice

- [Visão Geral](#-visão-geral)
- [Stack Utilizada](#-stack-utilizada)
- [Pré-requisitos](#-pré-requisitos)
- [Rodando com Docker (recomendado)](#-rodando-com-docker-recomendado)
- [Rodando localmente (sem Docker)](#-rodando-localmente-sem-docker)
- [Usuários de Teste](#-usuários-de-teste)
- [Testes Automatizados](#-testes-automatizados)
- [Endpoints da API](#-endpoints-da-api)
- [Decisões Técnicas](#-decisões-técnicas)
- [O que foi implementado](#-o-que-foi-implementado)

---

## Visão Geral

O **ReembolsaAI** permite que colaboradores criem pedidos de reembolso, gestores aprovem ou rejeitem solicitações e o financeiro marque como pagas. O sistema possui controle de acesso por perfil (RBAC), histórico de auditoria, validações com Zod e testes de integração.

**Fluxo principal:**

```
Colaborador cria → Gestor aprova/rejeita → Financeiro paga
```

---

## Stack Utilizada

| Camada          | Tecnologia                           |
| --------------- | ------------------------------------ |
| Linguagem       | TypeScript + JavaScript              |
| Backend         | Node.js + Express.js                 |
| Validação       | Zod                                  |
| Autenticação    | JWT                                  |
| Banco de dados  | Prisma ORM + PostgreSQL              |
| Datas           | DayJS                                |
| Testes backend  | Jest + Supertest                     |
| Frontend        | React + Vite + Functional Components |
| Navegação       | React Router                         |
| Estado global   | Context API                          |
| UI              | Chakra UI / ShadcnUI                 |
| HTTP Client     | Axios                                |
| Containerização | Docker + Docker Compose              |

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados, **ou**
- [Node.js 20+](https://nodejs.org/) e [npm](https://www.npmjs.com/) instalados localmente

---

## Rodando com Docker (recomendado)

Esta é a forma mais simples de subir o projeto completo (banco, backend e frontend).

### 1. Clone o repositório

```bash
git clone https://github.com/leticiagaspar/reimbursement-project.git
cd reimbursement-project
```

### 2. Configure as variáveis de ambiente

```bash
# No diretório backend/
cp backend/.env.example backend/.env
```

O `.env` já vem configurado para funcionar com o Docker Compose. Se precisar ajustar:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/reimbursement"
DIRECT_URL="postgresql://postgres:postgres@db:5432/reimbursement"
JWT_SECRET="reembolso-api-secret-key"
PORT=3333
```

> ⚠️ No Docker Compose o host do banco é `db` (nome do serviço). Localmente, troque por `localhost:5433`.

### 3. Suba os containers

```bash
docker compose up -d
```

### 4. Execute as migrations e o seed

Em outro terminal (com os containers já rodando):

```bash
docker compose exec backend npx prisma db push

# Popula o banco com dados iniciais
docker compose exec backend npx prisma db seed
```

### 5. Acesse a aplicação

| Serviço  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| API      | http://localhost:3333 |

---

Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

### 3. Configure e inicie o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Acesse a aplicação

| Serviço  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| API      | http://localhost:3333 |

---

## Usuários de Teste

O seed cria automaticamente **um usuário fixo para cada perfil** + 5 colaboradores extras com dados aleatórios (Faker.js). Todos usam a mesma senha:

| Perfil                     | E-mail               | Senha         |
| -------------------------- | -------------------- | ------------- |
| **ADMIN**                  | admin@empresa.com    | `password123` |
| **EMPLOYEE** (Colaborador) | employee@empresa.com | `password123` |
| **MANAGER** (Gestor)       | manager@empresa.com  | `password123` |
| **FINANCE** (Financeiro)   | finance@empresa.com  | `password123` |

Além disso, o seed popula o banco com:

- 📂 **6 categorias** — Alimentação, Transporte, Hospedagem, Internet/Home Office, Saúde e Outros
- 📄 **50 solicitações** geradas aleatoriamente com status, anexo e histórico já criados
- 🔁 Cada solicitação tem pelo menos um registro de histórico (`CREATED`); as aprovadas/rejeitadas/pagas possuem histórico adicional do gestor

> Use `manager@empresa.com` para aprovar/rejeitar e `finance@empresa.com` para marcar como pago.

---

## Testes Automatizados

Os testes foram implementados com **Jest + Supertest** para o backend, cobrindo autenticação, validações, regras de negócio e transições de status.

### Rodando os testes

```bash
cd backend

# Executa todos os testes
npm run test

# Executa com relatório de cobertura
npm run test:coverage
```

### O que está coberto pelos testes

- ✅ Autenticação (login com credenciais válidas e inválidas)
- ✅ Criação de solicitação com validações de campo
- ✅ Envio de solicitação para análise (`RASCUNHO → ENVIADO`)
- ✅ Aprovação de solicitação pelo gestor (`ENVIADO → APROVADO`)
- ✅ Rejeição com justificativa obrigatória (`ENVIADO → REJEITADO`)
- ✅ Pagamento de solicitação aprovada (`APROVADO → PAGO`)
- ✅ Bloqueio de transições de status inválidas
- ✅ Controle de permissões por perfil (RBAC)
- ✅ Registro de histórico de auditoria

---

## Endpoints da API

### Autenticação

| Método | Rota          | Descrição                     |
| ------ | ------------- | ----------------------------- |
| `POST` | `/auth/login` | Autentica e retorna token JWT |

### Usuários

| Método | Rota     | Descrição      | Perfil  |
| ------ | -------- | -------------- | ------- |
| `POST` | `/users` | Cria usuário   | Público |
| `GET`  | `/users` | Lista usuários | ADMIN   |

### Categorias

| Método | Rota              | Descrição          | Perfil      |
| ------ | ----------------- | ------------------ | ----------- |
| `GET`  | `/categories`     | Lista categorias   | Autenticado |
| `POST` | `/categories`     | Cria categoria     | ADMIN       |
| `PUT`  | `/categories/:id` | Atualiza categoria | ADMIN       |

### Solicitações de Reembolso

| Método | Rota                              | Descrição                                | Perfil      |
| ------ | --------------------------------- | ---------------------------------------- | ----------- |
| `GET`  | `/reimbursements`                 | Lista solicitações (filtrado por perfil) | Autenticado |
| `POST` | `/reimbursements`                 | Cria solicitação                         | COLABORADOR |
| `GET`  | `/reimbursements/:id`             | Detalha solicitação                      | Autenticado |
| `PUT`  | `/reimbursements/:id`             | Edita solicitação em RASCUNHO            | COLABORADOR |
| `POST` | `/reimbursements/:id/submit`      | Envia para análise                       | COLABORADOR |
| `POST` | `/reimbursements/:id/approve`     | Aprova solicitação                       | GESTOR      |
| `POST` | `/reimbursements/:id/reject`      | Rejeita com justificativa                | GESTOR      |
| `POST` | `/reimbursements/:id/pay`         | Marca como paga                          | FINANCEIRO  |
| `GET`  | `/reimbursements/:id/history`     | Histórico de auditoria                   | Autenticado |
| `POST` | `/reimbursements/:id/attachments` | Adiciona anexo                           | COLABORADOR |
| `GET`  | `/reimbursements/:id/attachments` | Lista anexos                             | Autenticado |

---

## Estrutura do Projeto

```
reembolsaai/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── @types/
│   │   ├── config/
│   │   ├── middlewares/
│   │   └── modules/
│   │       ├── attachments/
│   │       ├── auth/
│   │       ├── categories/
│   │       ├── reimbursements/
│   │       └── users/
│   ├── tests/
│   └── utils/
└── frontend/
    └── src/
        ├── assets/
        ├── components/
        ├── contexts/
        ├── hooks/
        ├── interfaces/
        ├── layouts/
        ├── pages/
        ├── routes/
        ├── services/
        ├── styles/
        └── utils/
```

---

## Decisões Técnicas

**Prisma como ORM:** Escolhido pela tipagem nativa com TypeScript, auto-complete no VSCode e migrations declarativas, o que facilita a evolução do schema sem conflitos.

**Zod para validação:** Toda entrada de dados (body, params, query) é validada por schemas Zod antes de chegar às regras de negócio, garantindo que erros de validação retornem sempre `400 Bad Request` com mensagens claras.

**Context API no frontend:** Utilizada para gerenciar o estado de autenticação (token, usuário logado, perfil), tornando as rotas privadas e o controle de permissões simples e centralizados.

**Histórico como auditoria:** Toda ação relevante (criar, enviar, aprovar, rejeitar, pagar, cancelar) gera um registro imutável de histórico com usuário, data/hora e observação, permitindo rastreabilidade completa.

**Seed com perfis distintos:** O seed usa `@faker-js/faker` (pt_BR) para gerar 50 solicitações realistas, cada uma com anexo simulado e histórico de auditoria. Quatro usuários fixos (um por perfil) garantem que todos os fluxos possam ser testados imediatamente após o `prisma db seed`.

---

## O que foi implementado

- [x] API RESTful com Node.js, Express e TypeScript
- [x] Autenticação JWT com middleware de proteção de rotas
- [x] RBAC — controle de permissões por perfil
- [x] Validação com Zod (body, params, query)
- [x] CRUD de categorias (com inativação)
- [x] CRUD de solicitações de reembolso
- [x] Fluxo completo: criar → enviar → aprovar/rejeitar → pagar
- [x] Histórico de auditoria por solicitação
- [x] Upload e listagem de anexos (simulado)
- [x] Tratamento de erros HTTP (400, 401, 403, 404, 500)
- [x] Testes de integração com Jest + Supertest
- [x] Frontend em React com React Router e Context API
- [x] Seed com usuários e dados de exemplo
- [x] Docker Compose para subir o ambiente completo
- [x] README com instruções de execução

---

## Licença

Este projeto foi desenvolvido como desafio técnico. Todos os direitos reservados ao autor.
