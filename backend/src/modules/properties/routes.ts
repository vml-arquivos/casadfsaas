import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { getContext } from "../../application/context";

const prisma = new PrismaClient();
const r = Router();

// Esquema de validação para criação/atualização de propriedade
const PropertySchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  city: z.string(),
  district: z.string().optional(),
  type: z.enum(['Apartamento', 'Casa', 'Terreno', 'Comercial']),
  price: z.number().positive(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  parking: z.number().int().optional(),
  area: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
  slug: z.string().optional(),
});

// Rota para buscar/listar propriedades (público)
r.get("/search", async (req, res) => {
  const { tenantId } = getContext(req);
  
  const { city, district, type, price_min, price_max, bedrooms } = req.query as any;
  const where: any = { tenantId };
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (district) where.district = { contains: district, mode: "insensitive" };
  if (type) where.type = type;
  if (bedrooms) where.bedrooms = Number(bedrooms);
  if (price_min || price_max) where.price = {
    gte: price_min ? Number(price_min) : undefined,
    lte: price_max ? Number(price_max) : undefined
  };
  const properties = await prisma.property.findMany({ where, orderBy: { createdAt: "desc" } });
  res.json(properties);
});

// Rota para obter uma propriedade por slug (público)
r.get("/:slug", async (req, res) => {
  const { tenantId } = getContext(req);
  const property = await prisma.property.findFirst({ where: { tenantId, slug: req.params.slug } });
  if (!property) return res.status(404).json({ error: "not_found" });
  res.json(property);
});

// Rota para criar uma nova propriedade (requer autenticação - simulada)
r.post("/", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const data = PropertySchema.parse(req.body);
    const newProperty = await prisma.property.create({
      data: {
        ...data,
        tenantId: tenantId,
        slug: data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      },
    });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: 'Dados inválidos', errors: error });
  }
});

export default r;
