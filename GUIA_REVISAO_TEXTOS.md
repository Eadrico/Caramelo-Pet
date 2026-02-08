# 📝 Guia de Revisão de Textos do App Caramelo

## 🎯 Arquivo Principal

**TODOS** os textos do app estão centralizados em:
```
src/lib/i18n/translations.ts
```

Este arquivo contém 230 chaves de tradução em 3 idiomas (inglês, português, espanhol).

---

## 📊 Categorias de Textos (230 total)

### 1. **INTRO** (9 textos)
Tela de boas-vindas inicial
- Título, subtítulo, features

### 2. **ONBOARDING** (41 textos)
Fluxo de cadastro do primeiro pet
- Passos do wizard, formulários, instruções

### 3. **HOME** (19 textos)
Tela principal do app
- Títulos, mensagens vazias, botões

### 4. **PET** (27 textos)
Detalhes e gerenciamento de pets
- Informações, formulários, ações

### 5. **CARE** (25 textos)
Itens de cuidado (vacinas, banho, etc)
- Tipos de cuidado, formulários, confirmações

### 6. **REMINDER** (não listado separadamente, dentro de care/common)
Lembretes e notificações

### 7. **COMMON** (42 textos)
Textos comuns usados em todo app
- Botões (salvar, cancelar, deletar)
- Dias da semana, meses
- Mensagens genéricas

### 8. **SETTINGS** (38 textos)
Configurações do app
- Perfil, preferências, sobre

### 9. **PAYWALL** (17 textos)
Tela de assinatura premium
- Benefícios, planos, call-to-actions

### 10. **PERMISSION** (4 textos)
Solicitações de permissão
- Câmera, galeria de fotos

### 11. **PHOTO** (2 textos)
Ações de foto
- Tirar foto, escolher da galeria

### 12. **REPEAT** (4 textos)
Opções de repetição
- Não repete, diário, semanal, mensal

### 13. **TAB** (2 textos)
Nomes das tabs
- Home, Settings

---

## 📋 Plano de Revisão Sugerido

### Opção 1: Revisar por Prioridade (Recomendado)

#### 🔴 Alta Prioridade (usuário vê primeiro)
1. **INTRO** (tela inicial) - 5 min
2. **ONBOARDING** (primeiro uso) - 15 min
3. **HOME** (tela principal) - 10 min
4. **COMMON** (usado em todo lugar) - 15 min

#### 🟡 Média Prioridade (usado frequentemente)
5. **PET** (detalhes de pets) - 10 min
6. **CARE** (cuidados) - 10 min
7. **SETTINGS** (configurações) - 10 min

#### 🟢 Baixa Prioridade (contextos específicos)
8. **PAYWALL** (monetização) - 5 min
9. **PERMISSION** (permissões) - 2 min
10. **PHOTO**, **REPEAT**, **TAB** - 3 min

**Tempo total estimado: ~90 minutos**

### Opção 2: Revisar Tudo de Uma Vez

Use o arquivo `TEXTOS_APP_PT.md` criado para você com TODOS os textos em português organizados por categoria.

---

## 🛠️ Como Fazer Alterações

### Método 1: Editar Direto no translations.ts

1. Abra o arquivo:
```bash
# Visualizar no Cursor
cursor src/lib/i18n/translations.ts
```

2. Encontre a seção de português:
```typescript
const pt: Translations = {
  // Intro Screen
  intro_welcome_title: 'Bem-vindo ao Caramelo',  // ← Edite aqui
  // ...
};
```

3. Faça as alterações desejadas

4. Commit e sincronize:
```bash
git add src/lib/i18n/translations.ts
git commit -m "copy: atualiza textos de [categoria]"
git push
./sync-to-server.sh
```

### Método 2: Revisar Antes no TEXTOS_APP_PT.md

1. Abra `TEXTOS_APP_PT.md` (arquivo criado para você)
2. Revise e anote as mudanças que quer fazer
3. Peça para eu fazer as alterações no translations.ts
4. Eu faço commit e sincronizo automaticamente

---

## 📂 Estrutura do translations.ts

```typescript
// 1. Tipos e definições
export type SupportedLanguage = 'system' | 'en' | 'pt' | 'es';
export const languageNames = { ... };
export const languageFlags = { ... };

// 2. Lista de todas as chaves (TranslationKey)
type TranslationKey =
  | 'intro_welcome_title'
  | 'intro_welcome_subtitle'
  | ...

// 3. Tipo do objeto de traduções
interface Translations {
  intro_welcome_title: string;
  intro_welcome_subtitle: string;
  ...
}

// 4. INGLÊS
const en: Translations = {
  intro_welcome_title: 'Welcome to Caramelo',
  // ... todos os textos em inglês
};

// 5. PORTUGUÊS ← VOCÊ VAI EDITAR AQUI
const pt: Translations = {
  intro_welcome_title: 'Bem-vindo ao Caramelo',
  // ... todos os textos em português
};

// 6. ESPANHOL
const es: Translations = {
  intro_welcome_title: 'Bienvenido a Caramelo',
  // ... todos os textos em espanhol
};

// 7. Exportação
export const translations = { en, pt, es };
```

---

## 🔍 Buscar Textos Específicos

### Por Chave
```bash
grep "intro_welcome_title" src/lib/i18n/translations.ts
```

### Por Categoria
```bash
# Todos os textos de onboarding
grep "onboarding_" src/lib/i18n/translations.ts | grep "pt:"

# Todos os textos de settings
grep "settings_" src/lib/i18n/translations.ts | grep "pt:"
```

### Por Conteúdo
```bash
# Encontrar onde está o texto "Bem-vindo"
grep "Bem-vindo" src/lib/i18n/translations.ts
```

---

## 💡 Dicas de Revisão

### O que Revisar?

1. **Tom de Voz**
   - Está consistente? (formal vs informal)
   - Está usando "você" ou "tu"?
   
2. **Clareza**
   - Textos são claros e objetivos?
   - Usuário entende a ação/informação?

3. **Erros**
   - Typos, acentuação
   - Concordância verbal/nominal

4. **UX Writing**
   - Botões são acionáveis? ("Adicionar Pet" melhor que "Pet")
   - Mensagens de erro são úteis?
   - Textos longos podem ser reduzidos?

### Convenções do App

- **Botões**: Verbos no infinitivo ("Adicionar", "Salvar", "Cancelar")
- **Títulos**: Substantivos ou frases curtas
- **Descrições**: Frases completas com pontuação
- **Placeholders**: Exemplos claros do que esperar

---

## 🚀 Workflow Recomendado

### Para Mudanças Pequenas (1-5 textos)

```bash
# 1. Edite diretamente o arquivo
vim src/lib/i18n/translations.ts

# 2. Commit e sincronize
git add .
git commit -m "copy: ajusta texto de boas-vindas"
git push
./sync-to-server.sh

# 3. Teste no app imediatamente (hot reload)
```

### Para Mudanças Grandes (muitos textos)

```bash
# 1. Crie uma branch específica
git checkout -b review/textos-app

# 2. Revise uma categoria por vez
# Edite, commit, teste

# 3. Quando terminar
git push -u origin review/textos-app

# 4. Merge na branch principal depois
```

---

## 📝 Exemplos de Alterações Comuns

### Mudar Tom de Voz

**Antes:**
```typescript
intro_welcome_title: 'Bem-vindo ao Caramelo',
```

**Depois (mais casual):**
```typescript
intro_welcome_title: 'Oi! Bem-vindo ao Caramelo',
```

### Simplificar Texto

**Antes:**
```typescript
onboarding_step1_subtitle: 'Vamos começar cadastrando as informações básicas do seu primeiro pet',
```

**Depois:**
```typescript
onboarding_step1_subtitle: 'Vamos cadastrar seu primeiro pet',
```

### Melhorar Call-to-Action

**Antes:**
```typescript
common_save: 'Salvar',
```

**Depois:**
```typescript
common_save: 'Salvar Alterações',
```

---

## ⚠️ Avisos Importantes

### ❌ NÃO faça isso:

1. **Não adicione novas chaves** sem atualizar o tipo `TranslationKey`
2. **Não delete chaves existentes** sem verificar uso no código
3. **Não esqueça de atualizar os 3 idiomas** (en, pt, es)
4. **Não use caracteres especiais** sem escapar (`\'` para aspas)

### ✅ Sempre faça isso:

1. **Mantenha consistência** entre idiomas
2. **Teste no app** depois das mudanças
3. **Commit com mensagens descritivas**
4. **Sincronize com servidor** para ver mudanças

---

## 🎯 Próximos Passos

1. **Revise `TEXTOS_APP_PT.md`** - Todos textos em português organizados
2. **Escolha uma categoria** para começar (sugiro INTRO ou HOME)
3. **Faça as edições** no `translations.ts`
4. **Me avise** quais mudanças quer fazer e eu ajudo

---

## 📞 Como Pedir Ajuda

### Formato Recomendado:

```
Categoria: ONBOARDING
Chave: onboarding_step1_title
Texto Atual: "Vamos começar!"
Novo Texto: "Cadastre seu Pet"
Razão: Mais específico e direto
```

Ou simplesmente:

```
Quero revisar todos os textos de INTRO
```

---

**Criado em:** 8 de fevereiro de 2026
