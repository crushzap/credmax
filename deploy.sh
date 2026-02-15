#!/bin/bash

# Script de Deploy para VPS (aaPanel/Linux)
# Uso: ./deploy.sh

# Parar execução em caso de erro
set -e

echo "🚀 Iniciando deploy do CredMax..."

# 1. Puxar últimas alterações do Git
echo "📦 Atualizando código (git pull)..."
git pull

# 2. Instalar dependências do Node.js
echo "📚 Instalando dependências (npm install)..."
npm install

# 3. Build do Frontend (Vite -> dist)
echo "🏗️ Construindo o frontend (npm run build)..."
npm run build

# 4. Reiniciar o servidor (PM2, se existir)
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "credmax"; then
        echo "🔄 Reiniciando processo PM2 'credmax'..."
        pm2 restart credmax
    else
        echo "⚠️ Processo 'credmax' não encontrado no PM2. Se você configurou via aaPanel, pode reiniciar pelo painel."
        # Exemplo de start manual:
        # pm2 start server.cjs --name "credmax"
    fi
else
    echo "ℹ️ PM2 não detectado no PATH. Se estiver usando o painel do aaPanel, reinicie o projeto pela interface."
fi

echo "✅ Deploy finalizado com sucesso!"
echo "🌐 O servidor deve estar rodando na porta definida no .env (Padrão: 3005)"
