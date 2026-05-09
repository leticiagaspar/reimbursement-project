import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { Action, Role, Status } from "@prisma/client";

jest.setTimeout(60000);

let colaboradorToken: string;
let gestorToken: string;
let financeiroToken: string;
let colaboradorId: string;
let categoryId: string;
let reimbursementId: string;

async function createUserAndLogin(
  email: string,
  role: Role,
): Promise<{ token: string; id: string }> {
  const password = await bcrypt.hash("senha123", 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { password, role },
    create: { name: `Test ${role}`, email, password, role },
  });

  const res = await request(app)
    .post("/auth/login")
    .send({ email, password: "senha123" });

  return { token: res.body.token, id: user.id };
}

beforeAll(async () => {
  const col = await createUserAndLogin("test_col@test.com", Role.EMPLOYEE);
  colaboradorToken = col.token;
  colaboradorId = col.id;

  const ges = await createUserAndLogin("test_ges@test.com", Role.MANAGER);
  gestorToken = ges.token;

  const fin = await createUserAndLogin("test_fin@test.com", Role.FINANCE);
  financeiroToken = fin.token;

  const category = await prisma.category.create({
    data: { name: "Categoria Teste " + Date.now(), active: true },
  });
  categoryId = category.id;
});

afterAll(async () => {
  await prisma.history.deleteMany({
    where: { reimbursement: { userId: colaboradorId } },
  });
  await prisma.attachment.deleteMany({
    where: { reimbursement: { userId: colaboradorId } },
  });
  await prisma.reimbursement.deleteMany({ where: { userId: colaboradorId } });
  await prisma.category.delete({ where: { id: categoryId } }).catch(() => {});
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["test_col@test.com", "test_ges@test.com", "test_fin@test.com"],
      },
    },
  });
  await prisma.$disconnect();
});

// AUTH

describe("POST /auth/login", () => {
  it("retorna 200 e token com credenciais válidas", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test_col@test.com", password: "senha123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("role", Role.EMPLOYEE);
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("retorna 401 com senha incorreta", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test_col@test.com", password: "errada" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Credenciais inválidas.");
  });

  it("retorna 400 com e-mail inválido", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "nao-eh-email", password: "senha123" });

    expect(res.status).toBe(400);
  });

  it("retorna 401 sem token em rota protegida", async () => {
    const res = await request(app).get("/reimbursements");
    expect(res.status).toBe(401);
  });
});

// REIMBURSEMENTS - criar

describe("POST /reimbursements", () => {
  it("cria solicitação em RASCUNHO com dados válidos", async () => {
    const res = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Almoço com cliente",
        value: 85.5,
        expenseDate: "2024-01-15",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("status", Status.DRAFT);
    reimbursementId = res.body.id;
  });

  it("retorna 400 com valor zero", async () => {
    const res = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Teste valor zero",
        value: 0,
        expenseDate: "2024-01-15",
      });

    expect(res.status).toBe(400);
  });

  it("retorna 400 com data futura", async () => {
    const res = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Despesa futura",
        value: 50,
        expenseDate: "2099-01-01",
      });

    expect(res.status).toBe(400);
  });

  it("retorna 400 com categoria inativa", async () => {
    const inactiveCategory = await prisma.category.create({
      data: { name: "Inativa " + Date.now(), active: false },
    });

    const res = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId: inactiveCategory.id,
        description: "Teste categoria inativa",
        value: 50,
        expenseDate: "2024-01-15",
      });

    expect(res.status).toBe(400);
    await prisma.category.delete({ where: { id: inactiveCategory.id } });
  });
});

// REIMBURSEMENTS - fluxo

describe("Fluxo completo: submit -> approve -> pay", () => {
  it("colaborador envia solicitação (RASCUNHO -> ENVIADO)", async () => {
    const res = await request(app)
      .post(`/reimbursements/${reimbursementId}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", Status.SUBMITTED);
  });

  it("colaborador não pode aprovar (403)", async () => {
    const res = await request(app)
      .post(`/reimbursements/${reimbursementId}/approve`)
      .set("Authorization", `Bearer ${colaboradorToken}`);

    expect(res.status).toBe(403);
  });

  it("financeiro não pode aprovar (403)", async () => {
    const res = await request(app)
      .post(`/reimbursements/${reimbursementId}/approve`)
      .set("Authorization", `Bearer ${financeiroToken}`);

    expect(res.status).toBe(403);
  });

  it("gestor aprova solicitação (ENVIADO -> APROVADO)", async () => {
    const res = await request(app)
      .post(`/reimbursements/${reimbursementId}/approve`)
      .set("Authorization", `Bearer ${gestorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", Status.APPROVED);
  });

  it("não pode aprovar duas vezes (transição inválida)", async () => {
    const res = await request(app)
      .post(`/reimbursements/${reimbursementId}/approve`)
      .set("Authorization", `Bearer ${gestorToken}`);

    expect(res.status).toBe(400);
  });

  it("colaborador não pode pagar (403)", async () => {
    const res = await request(app)
      .post(`/reimbursements/${reimbursementId}/pay`)
      .set("Authorization", `Bearer ${colaboradorToken}`);

    expect(res.status).toBe(403);
  });

  it("financeiro paga solicitação (APROVADO -> PAGO)", async () => {
    const res = await request(app)
      .post(`/reimbursements/${reimbursementId}/pay`)
      .set("Authorization", `Bearer ${financeiroToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", Status.PAID);
  });

  it("não pode cancelar solicitação PAGA", async () => {
    const res = await request(app)
      .post(`/reimbursements/${reimbursementId}/cancel`)
      .set("Authorization", `Bearer ${colaboradorToken}`);

    expect(res.status).toBe(400);
  });
});

describe("Fluxo de rejeição", () => {
  let rejectId: string;

  beforeAll(async () => {
    const created = await request(app)
      .post("/reimbursements")
      .set("Authorization", `Bearer ${colaboradorToken}`)
      .send({
        categoryId,
        description: "Solicitação para rejeitar",
        value: 30,
        expenseDate: "2024-02-01",
      });
    rejectId = created.body.id;

    await request(app)
      .post(`/reimbursements/${rejectId}/submit`)
      .set("Authorization", `Bearer ${colaboradorToken}`);
  });

  it("retorna 400 ao rejeitar sem justificativa", async () => {
    const res = await request(app)
      .post(`/reimbursements/${rejectId}/reject`)
      .set("Authorization", `Bearer ${gestorToken}`)
      .send({ rejectionReason: "" });

    expect(res.status).toBe(400);
  });

  it("gestor rejeita com justificativa (ENVIADO -> REJEITADO)", async () => {
    const res = await request(app)
      .post(`/reimbursements/${rejectId}/reject`)
      .set("Authorization", `Bearer ${gestorToken}`)
      .send({ rejectionReason: "Comprovante ilegível." });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", Status.REJECTED);
    expect(res.body).toHaveProperty("rejectionReason", "Comprovante ilegível.");
  });
});

// HISTÓRICO

describe("GET /reimbursements/:id/history", () => {
  it("retorna histórico com ações registradas", async () => {
    const res = await request(app)
      .get(`/reimbursements/${reimbursementId}/history`)
      .set("Authorization", `Bearer ${colaboradorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    const actions = res.body.map((h: { action: string }) => h.action);
    expect(actions).toContain(Action.CREATED);
    expect(actions).toContain(Action.SUBMITTED);
    expect(actions).toContain(Action.APPROVED);
    expect(actions).toContain(Action.PAID);
  });
});

// FILTROS

describe("GET /reimbursements com filtros", () => {
  it("filtra por status", async () => {
    const res = await request(app)
      .get("/reimbursements?status=PAID")
      .set("Authorization", `Bearer ${colaboradorToken}`);

    expect(res.status).toBe(200);
    res.body.data.forEach((r: { status: string }) => {
      expect(r.status).toBe(Status.PAID);
    });
  });

  it("retorna 400 para status inválido", async () => {
    const res = await request(app)
      .get("/reimbursements?status=INVALIDO")
      .set("Authorization", `Bearer ${colaboradorToken}`);

    expect(res.status).toBe(400);
  });
});
