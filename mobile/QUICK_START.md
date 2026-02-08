# 🚀 Quick Start - Desenvolvimento com Vibecode

## Fluxo Recomendado: Local → Servidor

**Resposta curta:** Desenvolva localmente e sincronize com o servidor ✅

---

## ⚡ 3 Passos Simples

### 1. Edite e Commit
```bash
# Edite seus arquivos
git add .
git commit -m "feat: minha mudança"
```

### 2. Sincronize
```bash
./sync-to-server.sh
```

### 3. Teste no App
Abra o Vibecode App e veja as mudanças automaticamente!

---

## 🛠️ Comandos Mais Usados

```bash
# Ver status do servidor
./vibe status

# Ver logs em tempo real
./vibe logs

# Instalar nova dependência
./vibe install

# Limpar cache
./vibe clear-cache

# Reiniciar servidor
./vibe restart

# Conectar via SSH
./vibe connect

# Sincronizar código
./sync-to-server.sh

# Ver todas opções
./vibe help
```

---

## 📋 Workflow Completo

```bash
# 1. Editar código
vim src/components/MeuComponente.tsx

# 2. Commit
git add src/components/MeuComponente.tsx
git commit -m "feat: adiciona novo componente"

# 3. Sincronizar
./sync-to-server.sh

# 4. Testar no app (automático via hot reload)

# 5. Push para GitHub
git push
```

---

## ⚠️ Quando Instalar Dependência

```bash
# 1. Adicionar ao package.json localmente

# 2. Commit
git add package.json
git commit -m "deps: adiciona dayjs"

# 3. Sincronizar
./sync-to-server.sh

# 4. Instalar NO SERVIDOR
./vibe install

# 5. Agora pode usar no código
```

---

## 🆘 Problemas Comuns

### Mudanças não aparecem?
```bash
./vibe restart
```

### Cache travado?
```bash
./vibe clear-cache
./vibe restart
```

### Dependência não encontrada?
```bash
./vibe install
```

### Servidor e git dessincronizados?
```bash
# Se servidor está correto
./sync-from-server.sh

# Se git está correto
./sync-to-server.sh
```

---

## 📚 Documentação Completa

- **WORKFLOW_GUIDE.md** - Guia detalhado com todos workflows
- **SSH_CONNECTION.md** - Informações de conexão SSH
- **SYNC_SUMMARY.md** - Resumo da sincronização inicial

---

## 💡 Por que Local → Servidor?

✅ **Vantagens:**
- Controle total de versão
- Histórico completo no git
- Fácil reverter mudanças
- Colaboração facilitada
- CI/CD integrado

❌ **Evite editar direto no servidor:**
- Perde histórico
- Dificulta colaboração
- Fácil perder código
- Sem backup automático

---

**Última atualização:** 8 de fevereiro de 2026
