#!/bin/bash

# Script de Sincronização REVERSA: Servidor Vibecode → Git Local
# Uso: ./sync-from-server.sh [--dry-run]
# ⚠️ USO APENAS PARA EMERGÊNCIAS OU BACKUP

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações do servidor
SSH_HOST="019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io"
SSH_PORT="2222"
SSH_USER="vibecode"
SSH_PASS="unwanted-owl-seminar-profusely-nimble"
REMOTE_PATH="/home/user/workspace/mobile/"

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Banner
echo -e "${RED}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║   ⚠️  SINCRONIZAÇÃO REVERSA: Servidor → Local    ║"
echo "║              (Usar apenas em emergências)         ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

# Parse argumentos
DRY_RUN=false

for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN=true
            log_warning "Modo DRY-RUN ativado (apenas simulação)"
            ;;
    esac
done

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    log_error "Erro: package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Avisos
echo ""
log_warning "ATENÇÃO: Este script vai SOBRESCREVER arquivos locais com os do servidor!"
log_warning "Certifique-se de ter commitado suas mudanças importantes antes de continuar."
echo ""

# Verificar git status
if ! git diff-index --quiet HEAD --; then
    log_error "Você tem mudanças não commitadas!"
    git status --short
    echo ""
    log_error "Faça commit ou stash antes de sincronizar do servidor."
    exit 1
fi

read -p "Deseja continuar com a sincronização REVERSA? (digite 'sim' para confirmar): " -r
echo ""
if [[ ! $REPLY == "sim" ]]; then
    log_info "Sincronização cancelada."
    exit 0
fi

# Construir comando rsync
RSYNC_CMD="rsync -avz --progress"

# Adicionar dry-run se necessário
if [ "$DRY_RUN" = true ]; then
    RSYNC_CMD="$RSYNC_CMD --dry-run"
fi

# SSH options
RSYNC_CMD="$RSYNC_CMD -e \"sshpass -p '$SSH_PASS' ssh -p $SSH_PORT -o StrictHostKeyChecking=no\""

# Exclusões
EXCLUDES=(
    "node_modules"
    ".git"
    "bun.lock"
    ".expo"
    ".metro-cache"
    "expo.log"
    "*.log"
)

# Adicionar exclusões ao comando
for exclude in "${EXCLUDES[@]}"; do
    RSYNC_CMD="$RSYNC_CMD --exclude '$exclude'"
done

# Adicionar paths (REVERSO)
RSYNC_CMD="$RSYNC_CMD ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH} /workspace/"

# Mostrar informações
echo ""
log_info "Origem:  ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"
log_info "Destino: /workspace/"
log_info "Porta:   ${SSH_PORT}"
echo ""

# Executar sincronização
log_info "Iniciando sincronização REVERSA..."
echo ""

if eval $RSYNC_CMD; then
    echo ""
    log_success "Sincronização reversa concluída!"
    
    if [ "$DRY_RUN" = false ]; then
        echo ""
        log_info "Verifique as mudanças com: git status"
        log_warning "Não esqueça de fazer commit das mudanças sincronizadas!"
    fi
else
    echo ""
    log_error "Erro durante a sincronização!"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
