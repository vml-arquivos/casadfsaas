#!/bin/bash

# Script de Deploy para VPS DigitalOcean com Docker Compose e Traefik

# 1. Instalar Docker e Docker Compose (se não estiverem instalados)
if ! command -v docker &> /dev/null
then
    echo "Docker não encontrado. Instalando..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo "Docker instalado com sucesso."
fi

# 2. Verificar se o .env existe
if [ ! -f .env ]; then
    echo "ERRO: O arquivo .env não foi encontrado. Crie-o a partir do .env.example e preencha as variáveis."
    exit 1
fi

# 3. Executar o build e o deploy
echo "Iniciando o build e o deploy dos containers..."

# O comando 'docker compose' é o padrão agora, mas 'docker-compose' ainda funciona em alguns sistemas.
# Usaremos 'docker compose' (plugin) que é o mais moderno.
# Se o seu sistema ainda usa o binário antigo, substitua 'docker compose' por 'docker-compose'

# Parar e remover containers antigos (se existirem)
docker compose -f docker-compose.prod.yml down

# Construir as imagens
docker compose -f docker-compose.prod.yml build

# Executar as migrações do Prisma no container do backend
echo "Executando migrações do banco de dados..."
docker compose -f docker-compose.prod.yml run --rm backend pnpm prisma migrate deploy

# Iniciar os serviços em modo detached (segundo plano)
echo "Iniciando todos os serviços..."
docker compose -f docker-compose.prod.yml up -d

echo "Deploy concluído!"
echo "Verifique o status dos containers com: docker compose -f docker-compose.prod.yml ps"
echo "O frontend deve estar acessível em https://${DOMAIN_FRONTEND} (após a propagação do DNS e obtenção do certificado SSL)"
echo "A API deve estar acessível em https://${DOMAIN_BACKEND}"
echo "O n8n deve estar acessível em https://${DOMAIN_N8N}"
