import swaggerUi from "swagger-ui-express";
import { Router } from "express";

export function setupSwagger(router: Router) {
  const spec = {
    openapi: "3.0.0",
    info: { title: "CASADF API", version: "1.0.0" },
    paths: { 
      "/health": { get: { summary: "Healthcheck", responses: { "200": { description: "ok" }}}},
      "/properties/search": { get: { summary: "Busca de Imóveis", responses: { "200": { description: "Lista de imóveis" }}}},
      "/crm/leads": { post: { summary: "Criação de Lead", responses: { "201": { description: "Lead criado" }}}},
    }
  };
  router.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
