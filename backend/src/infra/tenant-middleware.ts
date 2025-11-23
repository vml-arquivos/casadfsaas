import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function tenantByHostMiddleware(req: Request, res: Response, next: NextFunction) {
  // Simulação de extração de tenantId
  (req as any).tenantId = 'tenant-simulado-123'; 
  next();
}
