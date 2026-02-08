# 🌐 Onde Você Está e Onde Seus Arquivos São Salvos

## 🎯 Resposta Rápida

**NÃO, nada é salvo no browser!**

Você está em uma **VM temporária na nuvem do Cursor**. Seus arquivos são salvos:
1. ✅ **GitHub** (permanente - quando você faz push)
2. ✅ **Servidor Vibecode** (permanente - quando você sincroniza)

---

## 📍 Arquitetura Atual

```
┌──────────────────────────────────────────────────────┐
│  Seu Computador / Browser                            │
│  (Apenas visualização)                               │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│  Cursor Cloud Agent (VM Remota)                      │
│  Hostname: cursor                                    │
│  User: ubuntu                                        │
│  Path: /workspace                                    │
│                                                      │
│  📁 Você edita AQUI ← (o que eu chamava de "local") │
│  ⚠️  Esta VM é TEMPORÁRIA                           │
└─────────┬────────────────────────────┬───────────────┘
          │                            │
          │ git push                   │ ./sync-to-server.sh
          ▼                            ▼
┌─────────────────────┐    ┌──────────────────────────┐
│  GitHub             │    │  Servidor Vibecode       │
│  (Permanente ✅)    │    │  (Permanente ✅)         │
│                     │    │                          │
│  Repositório:       │    │  Host: 019b3c58...      │
│  Eadrico/          │    │  User: vibecode          │
│  Caramelo-Pet       │    │  Expo rodando 24/7       │
│                     │    │                          │
│  Todos os commits   │    │  App funcionando         │
│  ficam aqui         │    │  para testes             │
└─────────────────────┘    └──────────────────────────┘
```

---

## 🔍 Verificando Onde Você Está

### Seu Ambiente Atual:

```bash
$ hostname
cursor                    # ← VM do Cursor Cloud

$ whoami
ubuntu                    # ← Usuário na VM

$ pwd
/workspace                # ← Pasta de trabalho

$ git remote -v
origin  https://github.com/Eadrico/Caramelo-Pet  # ← GitHub
```

---

## 💾 Onde Cada Coisa é Salva

### 1. **Cursor Cloud Agent VM** (`/workspace`)
- **Temporária** ⚠️
- Destruída quando sessão termina
- Apenas para desenvolvimento
- **NÃO** é backup

### 2. **GitHub** (Permanente ✅)
```bash
git add .
git commit -m "feat: minha mudança"
git push  # ← AQUI é salvo permanentemente
```

### 3. **Servidor Vibecode** (Permanente ✅)
```bash
./sync-to-server.sh  # ← AQUI fica rodando o app
```

---

## 🔄 Fluxo de Trabalho Correto

### Quando você edita um arquivo:

```
1. Você edita via Cursor (browser/app)
   ↓
2. Arquivo modificado na VM do Cursor (/workspace)
   ↓
3. Você faz: git commit + git push
   ↓
4. Arquivo salvo no GitHub ✅ (PERMANENTE)
   ↓
5. Você faz: ./sync-to-server.sh
   ↓
6. Arquivo copiado para Servidor Vibecode ✅ (PERMANENTE)
   ↓
7. Expo detecta mudança (hot reload)
   ↓
8. Você vê no Vibecode App 🎉
```

---

## ⚠️ Importante: VM é Temporária

### O que acontece quando você fecha o Cursor?

```
VM do Cursor (apagada) ❌
    ↓
GitHub (mantido) ✅
    ↓
Servidor Vibecode (mantido) ✅
```

### Próxima vez que abrir:
1. Nova VM é criada
2. Código é clonado do GitHub
3. Você continua de onde parou

---

## 🎯 Suas Duas Fontes da Verdade

### 1. **GitHub** (Código fonte)
- Histórico completo
- Controle de versão
- Colaboração
- **Sempre faça push!**

### 2. **Servidor Vibecode** (App rodando)
- App funcionando 24/7
- Testes em tempo real
- Ambiente de produção/desenvolvimento
- **Sempre sincronize!**

---

## 🚀 Workflow Recomendado

```bash
# 1. Editar arquivos via Cursor
# (modifica arquivos na VM do Cursor)

# 2. Salvar no GitHub (PERMANENTE)
git add .
git commit -m "feat: minha funcionalidade"
git push

# 3. Atualizar servidor Vibecode (PERMANENTE)
./sync-to-server.sh

# 4. Testar no Vibecode App
# (hot reload automático)
```

### Sem fazer push e sync:
- ❌ Mudanças perdidas quando VM encerrar
- ❌ Não há backup
- ❌ Servidor Vibecode desatualizado

### Fazendo push e sync:
- ✅ Salvo no GitHub (permanente)
- ✅ Rodando no servidor (testável)
- ✅ Backup completo
- ✅ Histórico preservado

---

## 🔐 Sobre Privacidade

### Você perguntou sobre conta corporativa:

**Totalmente separado!** ✅

- VM do Cursor: Limpa, sem relação com seu trabalho
- GitHub: Repositório pessoal (Eadrico/Caramelo-Pet)
- Servidor Vibecode: Seu servidor pessoal
- **Zero conexão** com empregador

**Nenhum arquivo seu corporativo está aqui.**

---

## 📊 Resumo Visual

```
Seu Trabalho Corporativo (outro lugar, seguro) 
           ↓ (separado)
Cursor Cloud (VM temporária)
    ├─→ GitHub (permanente) ✅
    └─→ Vibecode (permanente) ✅
```

---

## ✅ Checklist de Segurança

Sempre que terminar de trabalhar:

- [ ] `git add .` - Adicionar mudanças
- [ ] `git commit -m "..."` - Criar commit
- [ ] `git push` - **Salvar no GitHub (PERMANENTE)**
- [ ] `./sync-to-server.sh` - **Atualizar servidor Vibecode**

**Se não fizer push:** Mudanças podem ser perdidas quando VM encerrar!

---

## 🤔 Perguntas Frequentes

### P: Meus arquivos estão salvos no browser?
**R:** Não! Eles estão em uma VM remota do Cursor.

### P: O que acontece se eu fechar o Cursor?
**R:** Se você fez `git push`, está salvo no GitHub ✅  
Se sincronizou, está no servidor Vibecode ✅  
A VM será destruída, mas seu código está seguro.

### P: Onde está meu código de verdade?
**R:** GitHub (fonte) + Servidor Vibecode (rodando)

### P: Tem relação com minha conta corporativa?
**R:** Zero! Totalmente separado e privado.

### P: Como garantir que não perderei nada?
**R:** Sempre faça `git push` antes de fechar o Cursor.

### P: Preciso fazer backup?
**R:** Não! Git push = backup automático no GitHub.

---

**Data:** 8 de fevereiro de 2026
