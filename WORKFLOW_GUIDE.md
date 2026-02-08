# 🚀 Guia de Workflow - Desenvolvimento com Vibecode

Este guia explica o melhor fluxo de trabalho para desenvolver seu app mantendo sincronização entre Git e o servidor Vibecode.

---

## 📋 Visão Geral

### Fluxo Recomendado

```
┌─────────────────┐
│  1. Edita aqui  │  (Workspace local - Git)
│   (Código)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. Commit Git  │  (Controle de versão)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Sincroniza   │  (./sync-to-server.sh)
│   → Servidor    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Hot Reload   │  (Expo detecta automaticamente)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. Testa no App │  (Vibecode App)
└─────────────────┘
```

---

## 🛠️ Workflows Práticos

### Workflow 1: Mudança Simples de Código

**Cenário:** Alterar texto, estilo ou lógica em um componente

```bash
# 1. Edite o arquivo que deseja
# Por exemplo: src/components/HomeScreen.tsx

# 2. Veja as mudanças
git status
git diff

# 3. Commit local
git add src/components/HomeScreen.tsx
git commit -m "feat: adiciona novo botão na home"

# 4. Sincroniza com servidor (simulação primeiro)
./sync-to-server.sh --dry-run

# 5. Se estiver tudo ok, sincronize de verdade
./sync-to-server.sh

# 6. Push para GitHub
git push

# 7. Verifique no Vibecode App - mudanças aparecem automaticamente!
```

**Tempo total:** ~30 segundos

---

### Workflow 2: Adicionar Nova Dependência

**Cenário:** Instalar um novo pacote (ex: `dayjs`)

```bash
# 1. Adicione a dependência no package.json localmente
# OU use bun add localmente para gerar o package.json correto

# 2. Commit a mudança
git add package.json
git commit -m "deps: adiciona dayjs"

# 3. Sincroniza com servidor
./sync-to-server.sh

# 4. Instale a dependência NO SERVIDOR via SSH
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && bun install"

# 5. Agora pode usar a dependência no código
# Edite seus arquivos, commit e sincronize normalmente
```

**⚠️ IMPORTANTE:** Sempre instale novas dependências NO SERVIDOR usando o comando SSH acima.

---

### Workflow 3: Criar Novo Componente

**Cenário:** Criar um novo componente React

```bash
# 1. Crie o arquivo
touch src/components/MeuNovoComponente.tsx

# 2. Edite o componente
# (adicione seu código)

# 3. Commit
git add src/components/MeuNovoComponente.tsx
git commit -m "feat: adiciona componente MeuNovoComponente"

# 4. Sincroniza
./sync-to-server.sh

# 5. Use o componente em outro arquivo
# Edite, commit e sincronize novamente

# 6. Teste no Vibecode App
```

---

### Workflow 4: Múltiplas Mudanças

**Cenário:** Várias alterações em diferentes arquivos

```bash
# 1. Faça todas as edições necessárias

# 2. Veja o que mudou
git status

# 3. Commit todas de uma vez (ou commits separados)
git add .
git commit -m "feat: implementa sistema de notificações

- Adiciona NotificationService
- Atualiza HomeScreen com badge
- Adiciona configurações de notificação"

# 4. Sincroniza tudo de uma vez
./sync-to-server.sh

# 5. Push
git push
```

---

### Workflow 5: Mudança de Configuração (.env)

**Cenário:** Alterar variáveis de ambiente

```bash
# Opção A: Mudar APENAS no servidor (recomendado para credenciais)
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && nano .env"

# Opção B: Mudar localmente e sincronizar (para valores de desenvolvimento)
# Edite .env local
git add .env
git commit -m "config: atualiza variáveis de ambiente"
./sync-to-server.sh --with-env  # ⚠️ Note o flag --with-env
git push
```

---

## 🆘 Workflows de Emergência

### Emergência 1: Reverter Mudanças

**Cenário:** Algo quebrou e você quer voltar ao estado anterior

```bash
# 1. Reverter último commit
git revert HEAD

# 2. Sincronizar estado anterior com servidor
./sync-to-server.sh

# 3. Confirmar no app que está funcionando

# 4. Push da reversão
git push
```

---

### Emergência 2: Servidor tem código mais novo

**Cenário:** Por algum motivo o servidor tem mudanças que não estão no git

```bash
# 1. Certifique-se de ter commitado tudo localmente
git add .
git commit -m "backup: salva estado atual"

# 2. Sincronize DO SERVIDOR para o local
./sync-from-server.sh --dry-run  # Veja o que vai mudar
./sync-from-server.sh             # Sincronize de verdade

# 3. Veja as diferenças
git status
git diff

# 4. Commit as mudanças do servidor
git add .
git commit -m "sync: atualiza com mudanças do servidor"
git push
```

---

### Emergência 3: App travou no servidor

**Cenário:** O Expo no servidor parou de responder

```bash
# Reiniciar o serviço Expo no servidor
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "sv restart expo"

# Ver logs
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "tail -f /var/log/expo/current"
```

---

## 📝 Comandos Úteis

### Scripts de Sincronização

```bash
# Sincronizar local → servidor (normal)
./sync-to-server.sh

# Simular sincronização (ver o que vai mudar)
./sync-to-server.sh --dry-run

# Sincronizar incluindo .env
./sync-to-server.sh --with-env

# Sincronizar servidor → local (emergência)
./sync-from-server.sh

# Simular sincronização reversa
./sync-from-server.sh --dry-run
```

### SSH Direto

```bash
# Conectar ao servidor
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io

# Executar comando único
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && [SEU_COMANDO]"

# Ver logs do Expo
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "tail -f /home/user/workspace/mobile/expo.log"

# Ver processos
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "ps aux | grep expo"

# Instalar dependências
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && bun install"

# Limpar cache
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && rm -rf .expo .metro-cache"
```

### Git

```bash
# Ver status
git status

# Ver mudanças
git diff

# Ver últimos commits
git log --oneline -10

# Criar branch nova
git checkout -b feature/minha-funcionalidade

# Voltar para branch principal
git checkout cursor/app-ssh-connection-d617
```

---

## ⚠️ Coisas que NUNCA Fazer

### ❌ NÃO faça isso:

1. **Editar código diretamente no servidor via SSH**
   - Você perde controle de versão
   - Dificulta colaboração
   - Fácil perder mudanças

2. **Deletar `node_modules` localmente e sincronizar**
   - Isso vai quebrar o servidor
   - Use exclusões nos scripts (já configurado)

3. **Sincronizar sem commit**
   - Você pode perder mudanças
   - Dificulta reverter problemas

4. **Instalar dependências localmente sem instalar no servidor**
   - O app vai quebrar no servidor
   - Sempre instale no servidor também

5. **Fazer push sem testar no servidor**
   - Teste primeiro, depois faça push
   - Evita código quebrado no repositório

---

## ✅ Boas Práticas

### 👍 FAÇA isso:

1. **Sempre commit antes de sincronizar**
   - Permite reverter facilmente
   - Mantém histórico organizado

2. **Use commits pequenos e frequentes**
   - Mais fácil debugar problemas
   - Melhor histórico de mudanças

3. **Teste no Vibecode App antes de fazer push**
   - Garante que funciona
   - Evita bugs no repositório

4. **Use mensagens de commit descritivas**
   - `feat:` para novas funcionalidades
   - `fix:` para correções
   - `refactor:` para refatoração
   - `style:` para mudanças de estilo
   - `docs:` para documentação

5. **Sincronize frequentemente**
   - Veja mudanças mais rápido
   - Detecte problemas mais cedo

---

## 🎯 Checklist Diário

Antes de começar a trabalhar:
- [ ] `git pull` - Atualizar código
- [ ] Verificar se servidor está rodando (ver logs)

Durante o desenvolvimento:
- [ ] Editar código localmente
- [ ] Commit mudanças
- [ ] `./sync-to-server.sh` - Sincronizar
- [ ] Testar no Vibecode App
- [ ] Repetir

Ao finalizar o dia:
- [ ] Commit todas as mudanças
- [ ] `git push` - Enviar para GitHub
- [ ] Verificar se app está funcionando

---

## 🐛 Troubleshooting

### Problema: "Hot reload não está funcionando"

```bash
# Limpar cache e reiniciar
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && rm -rf .expo .metro-cache && sv restart expo"
```

### Problema: "Mudanças não aparecem no app"

1. Confirme que sincronizou: `./sync-to-server.sh`
2. Verifique logs: Ver comando acima em "SSH Direto"
3. Force refresh no app: Sacuda o dispositivo → Reload

### Problema: "Dependência não encontrada"

```bash
# Instalar dependências no servidor
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && bun install"
```

### Problema: "Git e servidor estão dessincronizados"

```bash
# Opção 1: Servidor está correto (pegar do servidor)
./sync-from-server.sh
git add .
git commit -m "sync: atualiza do servidor"

# Opção 2: Git está correto (enviar para servidor)
./sync-to-server.sh
```

---

## 📚 Recursos Adicionais

- `SSH_CONNECTION.md` - Informações de conexão SSH
- `SYNC_SUMMARY.md` - Resumo da última sincronização
- `CLAUDE.md` - Guia de desenvolvimento
- `README.md` - Documentação do projeto

---

**Última atualização:** 8 de fevereiro de 2026
