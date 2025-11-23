import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { getContext } from "../../application/context";

const prisma = new PrismaClient();
const r = Router();

// Esquema de validação para criação de Lead
const LeadSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.enum(['cold', 'warm', 'hot']).default('cold'),
  stage: z.string().default('Contato'),
});

// Rota para listar todos os Leads (requer autenticação - simulada)
r.get("/leads", async (req, res) => {
  const { tenantId } = getContext(req);
  const leads = await prisma.lead.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" }
  });
  res.json(leads);
});

// Rota para criar um novo Lead (pode ser pública, vindo de um formulário)
r.post("/leads", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const data = LeadSchema.parse(req.body);
    const newLead = await prisma.lead.create({
      data: {
        ...data,
        tenantId: tenantId,
      },
    });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ message: 'Dados inválidos', errors: error });
  }
});

// Rota para listar Deals (simulada)
r.get("/deals", async (req, res) => {
  const { tenantId } = getContext(req);
  const deals = await prisma.deal.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });
  res.json(deals);
});

// Rota para criar Deals (simulada)
r.post("/deals", async (req, res) => {
  const { tenantId } = getContext(req);
  const deal = await prisma.deal.create({ data: { tenantId, leadId: 'simulado', title: 'Novo Negócio', ...req.body } });
  res.status(201).json(deal);
});

export default r;
