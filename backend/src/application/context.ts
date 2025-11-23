import { Request } from "express";
export type AppContext = { tenantId: string; userId?: string; roles?: string[]; };
export function getContext(req: Request): AppContext { 
  // Simulação de contexto
  return { 
    tenantId: (req as any).tenantId || 'tenant-simulado-123', 
    userId: (req as any).userId,
    roles: (req as any).roles || ['admin']
  }; 
}
