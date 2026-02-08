#!/bin/bash

# Script de Sincronização: Git Local → Servidor Vibecode
# Uso: ./sync-to-server.sh [--dry-run] [--with-env]

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
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║   Sincronização: Git Local → Servidor Vibecode   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

# Parse argumentos
DRY_RUN=false
SYNC_ENV=false

for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN=true
            log_warning "Modo DRY-RUN ativado (apenas simulação)"
            ;;
        --with-env)
            SYNC_ENV=true
            log_warning "Arquivo .env será sincronizado"
            ;;
    esac
done

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    log_error "Erro: package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Verificar git status
log_info "Verificando status do git..."
if ! git diff-index --quiet HEAD --; then
    log_warning "Você tem mudanças não commitadas:"
    git status --short
    echo ""
    read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Sincronização cancelada."
        exit 0
    fi
fi

# Construir comando rsync
RSYNC_CMD="rsync -avz --progress"

# Adicionar dry-run se necessário
if [ "$DRY_RUN" = true ]; then
    RSYNC_CMD="$RSYNC_CMD --dry-run"
fi

# SSH options
RSYNC_CMD="$RSYNC_CMD -e \"sshpass -p '$SSH_PASS' ssh -p $SSH_PORT -o StrictHostKeyChecking=no\""

# Exclusões padrão (sempre)
EXCLUDES=(
    "node_modules"
    ".git"
    ".expo"
    ".metro-cache"
    "expo.log"
    "*.log"
    ".DS_Store"
    "sync-to-server.sh"
    "sync-from-server.sh"
    "vibe"
    # Documentação (GitHub only, não no servidor Vibecode)
    "SSH_CONNECTION.md"
    "SYNC_SUMMARY.md"
    "WORKFLOW_GUIDE.md"
    "QUICK_START.md"
    "ONDE_ESTOU.md"
    "TEXTOS_APP_PT.md"
    "GUIA_REVISAO_TEXTOS.md"
    "SUGESTOES_TOM_CASUAL.md"
    "COMPARATIVO_3_IDIOMAS.md"
    "CORRECAO_HARDCODED.md"
    "PLANO_REFATORACAO_MODALS.md"
    "REFATORACAO_COMPLETA.md"
    "RESUMO_SESSAO.md"
    "MELHORIAS_OPCIONAIS_IMPLEMENTADAS.md"
    "ANALISE_COMPLETA_IMAGENS.md"
    "PLANO_OTIMIZACAO_IMAGENS.md"
    "MAPEAMENTO_COMPLETO_LOGOS.md"
    "OTIMIZACAO_IMAGENS_COMPLETA.md"
)

# Adicionar .env às exclusões se não for para sincronizar
if [ "$SYNC_ENV" = false ]; then
    EXCLUDES+=(".env")
    log_info "Arquivo .env será PRESERVADO no servidor"
else
    log_warning "Arquivo .env será SOBRESCRITO no servidor"
fi

# Adicionar exclusões ao comando
for exclude in "${EXCLUDES[@]}"; do
    RSYNC_CMD="$RSYNC_CMD --exclude '$exclude'"
done

# Adicionar paths
RSYNC_CMD="$RSYNC_CMD /workspace/ ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"

# Mostrar informações
echo ""
log_info "Origem:  /workspace/"
log_info "Destino: ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"
log_info "Porta:   ${SSH_PORT}"
echo ""

# Executar sincronização
log_info "Iniciando sincronização..."
echo ""

if eval $RSYNC_CMD; then
    echo ""
    log_success "Sincronização concluída!"
    
    if [ "$DRY_RUN" = false ]; then
        # Verificar se há mudanças em package.json
        if git diff HEAD~1 HEAD --name-only | grep -q "package.json"; then
            echo ""
            log_warning "package.json foi modificado!"
            log_info "Você pode precisar instalar dependências no servidor:"
            echo ""
            echo -e "${YELLOW}  sshpass -p '$SSH_PASS' ssh -p $SSH_PORT ${SSH_USER}@${SSH_HOST} 'cd ${REMOTE_PATH} && bun install'${NC}"
            echo ""
        fi
        
        log_info "O Expo no servidor detectará as mudanças automaticamente (hot reload)"
        log_success "Verifique o app no Vibecode App!"
    fi
else
    echo ""
    log_error "Erro durante a sincronização!"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
