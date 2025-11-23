# CasaDF SaaS - Super SaaS

Este é o repositório do projeto CasaDF SaaS, uma solução completa de software como serviço (SaaS) para o mercado imobiliário, incluindo Backend (Node.js/Express/TypeScript), Frontend (Next.js), Mobile (React Native - *não configurado para deploy web*), Banco de Dados (PostgreSQL), Cache (Redis), Motor de Busca Vetorial (Qdrant) e Automação (n8n).

## Stack Tecnológica

| Componente | Tecnologia | Linguagem/Framework |
| :--- | :--- | :--- |
| **Backend** | API RESTful | Node.js, Express, TypeScript |
| **Frontend** | Aplicação Web | Next.js, React |
| **Banco de Dados** | Persistência de Dados | PostgreSQL (via Prisma ORM) |
| **Cache/Mensageria** | Cache e Filas | Redis (via BullMQ) |
| **Busca Vetorial** | IA/Embeddings | Qdrant |
| **Automação** | Fluxos de Trabalho | n8n |
| **Containerização** | Empacotamento | Docker, Docker Compose |
| **Deploy** | Orquestração/Proxy | Traefik (para SSL e Roteamento) |

## Estrutura do Repositório

O projeto é um monorepo gerenciado por `pnpm` (embora o deploy final use Docker, a estrutura é mantida):

- `backend/`: Código-fonte da API (Node.js/Express/TypeScript).
- `frontend/`: Código-fonte da aplicação web (Next.js/React).
- `mobile/`: Código-fonte da aplicação mobile (React Native).
- `prisma/`: Esquema do banco de dados (`schema.prisma`) e scripts de seed.
- `docker/`: Arquivos `Dockerfile` para o `backend` e `frontend`.
- `n8n/`: Workflows de automação para o n8n.
- `docker-compose.yml`: Configuração de desenvolvimento.
- `docker-compose.prod.yml`: **Configuração de produção com Traefik para SSL/HTTPS.**
- `.env.example`: Exemplo das variáveis de ambiente necessárias.
- `.env`: **Arquivo de variáveis de ambiente para produção (DEVE SER PREENCHIDO).**
- `deploy.sh`: **Script de deploy automatizado para VPS (DigitalOcean).**

## Guia de Deploy (Produção)

O deploy foi configurado para ser realizado em uma VPS (como a DigitalOcean) utilizando **Docker Compose** e **Traefik** para gerenciar o roteamento, HTTPS e certificados SSL (Let's Encrypt) automaticamente.

### Pré-requisitos

1.  **VPS com Docker:** Uma máquina virtual (DigitalOcean Droplet) com Docker e Docker Compose Plugin instalados.
2.  **Domínios Configurados:** Três subdomínios apontando para o IP da sua VPS:
    - `casadfsaas.com` (ou seu domínio principal) -> Para o **Frontend**
    - `api.casadfsaas.com` (ou seu subdomínio de API) -> Para o **Backend**
    - `n8n.casadfsaas.com` (ou seu subdomínio de automação) -> Para o **n8n**

### Passos para o Deploy

#### 1. Clonar o Repositório

Após subir este projeto para o seu GitHub, clone-o na sua VPS:

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

#### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e preencha as variáveis. **É crucial alterar os segredos (`JWT_SECRET`, `JWT_REFRESH_SECRET`), configurar os domínios (`DOMAIN_FRONTEND`, `DOMAIN_BACKEND`, `DOMAIN_N8N`) e o e-mail do Traefik (`TRAEFIK_EMAIL`).**

```bash
cp .env.example .env
# Edite o arquivo .env com seus dados
nano .env
```

#### 3. Executar o Deploy

O script `deploy.sh` automatiza a instalação do Docker (se necessário), o build das imagens, a execução das migrações do banco de dados e a inicialização dos serviços em modo de produção.

```bash
# Tornar o script executável (se não estiver)
chmod +x deploy.sh

# Executar o deploy
./deploy.sh
```

### Comandos Úteis

| Comando | Descrição |
| :--- | :--- |
| `./deploy.sh` | Executa o deploy completo (build, migração e `up -d`). |
| `docker compose -f docker-compose.prod.yml up -d` | Inicia os containers em modo detached. |
| `docker compose -f docker-compose.prod.yml down` | Para e remove todos os containers, redes e volumes (exceto os volumes de dados). |
| `docker compose -f docker-compose.prod.yml logs -f` | Visualiza os logs de todos os serviços em tempo real. |
| `docker compose -f docker-compose.prod.yml ps` | Lista o status dos containers. |
| `docker compose -f docker-compose.prod.yml run --rm backend pnpm prisma migrate deploy` | Executa as migrações do banco de dados. |
| `docker compose -f docker-compose.prod.yml run --rm backend pnpm prisma db seed` | Executa o script de seed (população inicial) do banco de dados. |

## Quickstart (Desenvolvimento Local)

Para rodar o projeto localmente (sem Traefik), use o arquivo `docker-compose.yml` original:

```bash
# 1. Copie o arquivo de ambiente
cp .env.example .env

# 2. Suba os containers
docker compose up --build

# Acesso:
# - Frontend: http://localhost:3000
# - API/Swagger: http://localhost:3001/docs
# - n8n: http://localhost:5678
```
