import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from '@prisma/client';

// Importar componentes da estrutura
import { tenantByHostMiddleware } from "./infra/tenant-middleware";
import { setupSwagger } from "./infra/swagger";
import { setupRealtime } from "./infra/realtime";
import crmRoutes from "./modules/crm/routes";
import propertiesRoutes from "./modules/properties/routes";
import { exceptionFilter } from "./shared/exception-filter";
import logger from "./shared/logger";

const app = express();
export const prisma = new PrismaClient();

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.APP_URL }));
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(tenantByHostMiddleware);

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Configuração da API
const api = express.Router();
setupSwagger(api); // Configuração do Swagger (documentação)
api.use("/crm", crmRoutes);
api.use("/properties", propertiesRoutes);

app.use("/api", api);
app.use(exceptionFilter); // Tratamento de erros

const server = http.createServer(app);
setupRealtime(server); // Configuração do Socket.io (Realtime)

const port = Number(process.env.PORT || 3001);

// Conectar ao banco de dados e iniciar o servidor
const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Conectado ao banco de dados com sucesso.');
    server.listen(port, () => {
      logger.info(`Servidor backend rodando em http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Não foi possível conectar ao banco de dados:', error);
    process.exit(1);
  }
};

startServer();
