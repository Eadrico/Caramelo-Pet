# 🔧 Correção de Textos Hardcoded

## 📋 Problemas Encontrados e Corrigidos

### ✅ Problema 1: "Adicionar ao Calendário" (CRÍTICO)

**Locais:** 2 componentes  
**Impacto:** Texto aparecia sempre em português, independente do idioma selecionado

#### Arquivos corrigidos:
- `src/components/AddCareItemSheet.tsx` (linha 659)
- `src/components/AddReminderSheet.tsx` (linha 540)

#### Antes:
```tsx
<Text>Adicionar ao Calendário</Text>
<Text>Sincronize com seu calendário pessoal</Text>
```

#### Depois:
```tsx
<Text>{t('calendar_add_to_calendar')}</Text>
<Text>{t('calendar_sync_description')}</Text>
```

#### Traduções adicionadas:
- 🇧🇷 PT: "Adicionar ao calendário" / "Sincronize com seu calendário pessoal"
- 🇺🇸 EN: "Add to calendar" / "Sync with your personal calendar"
- 🇪🇸 ES: "Agregar al calendario" / "Sincroniza con tu calendario personal"

---

### ✅ Problema 2: Espécie do Pet em Inglês (CRÍTICO)

**Local:** OnboardingReview.tsx (linha 226-227)  
**Impacto:** Sempre mostrava "Cat", "Dog", "Other" em inglês

#### Antes:
```tsx
{onboardingData.species.charAt(0).toUpperCase() + 
 onboardingData.species.slice(1)}
// Resultado: "Cat" (sempre em inglês)
```

#### Depois:
```tsx
{t(getSpeciesTranslationKey(onboardingData.species))}
// Resultado: 🇧🇷 "Gato", 🇺🇸 "Cat", 🇪🇸 "Gato"
```

#### Solução:
1. Criada função helper `getSpeciesTranslationKey()` em `types.ts`
2. Retorna chave apropriada: `pet_species_dog`, `pet_species_cat`, `pet_species_other`
3. Tradução já existia, só faltava usar!

---

### ✅ Problema 3: Mensagens de Cupom (CRÍTICO)

**Locais:** PaywallScreen.tsx e PremiumUpsellModal.tsx  
**Impacto:** Mensagens de erro/validação sempre em português

#### Arquivos corrigidos:
- `src/components/PaywallScreen.tsx` (linha 191, 601)
- `src/components/PremiumUpsellModal.tsx` (linha 166, 735)

#### Antes:
```tsx
setCouponError('Digite um cupom válido');
<Text>Insira um cupom válido ou restaure suas compras anteriores</Text>
```

#### Depois:
```tsx
setCouponError(t('paywall_coupon_invalid'));
<Text>{t('paywall_coupon_or_restore')}</Text>
```

#### Traduções adicionadas:
- 🇧🇷 PT: "Digite um cupom válido" / "Insira um cupom válido ou restaure..."
- 🇺🇸 EN: "Enter a valid coupon" / "Enter a valid coupon or restore..."
- 🇪🇸 ES: "Ingresa un cupón válido" / "Ingresa un cupón válido o restaura..."

---

### ✅ Problema 4: `textTransform: 'capitalize'` (CSS)

**Local:** OnboardingInfo.tsx  
**Impacto:** Forçava "Quando nasceu?" virar "Quando Nasceu?"

#### Removido de:
- Linha 179: Nomes dos meses no picker
- Linha 420: Placeholder do campo de data

#### Antes:
```tsx
style={{ textTransform: 'capitalize' }}
// Resultado: "Quando Nasceu?" ❌
```

#### Depois:
```tsx
style={{}}
// Resultado: "Quando nasceu?" ✅
```

---

## 📊 Estatísticas

### Arquivos Modificados: 7
1. `src/lib/i18n/translations.ts` - Novas chaves
2. `src/lib/types.ts` - Função helper
3. `src/components/AddCareItemSheet.tsx` - Calendário
4. `src/components/AddReminderSheet.tsx` - Calendário
5. `src/components/PaywallScreen.tsx` - Cupom
6. `src/components/PremiumUpsellModal.tsx` - Cupom
7. `src/components/onboarding/OnboardingReview.tsx` - Espécie

### Novas Chaves de Tradução: 4
- `calendar_add_to_calendar` (3 idiomas)
- `calendar_sync_description` (3 idiomas)
- `paywall_coupon_invalid` (3 idiomas)
- `paywall_coupon_or_restore` (3 idiomas)

**Total: 12 novas traduções**

### Funções Helper: 1
- `getSpeciesTranslationKey()` em `types.ts`

### Estilos CSS Removidos: 2
- `textTransform: 'capitalize'` (2 ocorrências)

---

## 🧪 Como Testar

### Teste 1: Calendário
1. Mude idioma para **English**
2. Adicione um **cuidado** ou **lembrete**
3. Veja toggle: deve aparecer **"Add to calendar"**
4. Mude para **Português**
5. Deve aparecer **"Adicionar ao calendário"**

### Teste 2: Espécie
1. Mude idioma para **English**
2. Cadastre um **gato** no onboarding
3. Na tela de **Review**: deve aparecer **"Cat"**
4. Mude para **Português** antes de salvar
5. Deve aparecer **"Gato"** ✅

### Teste 3: Cupom
1. Mude idioma para **English**
2. Abra tela de **Premium**
3. Tente enviar cupom vazio
4. Erro deve aparecer: **"Enter a valid coupon"**
5. Mude para **Português**
6. Erro deve aparecer: **"Digite um cupom válido"**

### Teste 4: Placeholder Data
1. Qualquer idioma
2. Onboarding → **Informações principais**
3. Campo data de nascimento: **"Quando nasceu?"** (não "Quando Nasceu?") ✅

---

## ⚠️ Componentes com Hardcode Remanescente (Não Críticos)

### SandboxDevMenu.tsx
Textos hardcoded em português encontrados (~10 textos):
- "Estado atual"
- "Preço configurado"
- "Produtos disponíveis"
- etc.

**Motivo para não corrigir:** Menu apenas para desenvolvedores, não acessível por usuários normais.

**Se quiser corrigir:** Me avise e adiciono traduções também.

---

## 🎯 Resultado Final

### Antes:
❌ Idioma selecionado não respeitado em 3 lugares críticos  
❌ "Cat" aparecendo em português  
❌ "Adicionar ao Calendário" sempre em PT  
❌ "Quando Nasceu?" com Title Case forçado

### Depois:
✅ Todos os textos respeitam idioma selecionado  
✅ Espécie traduzida corretamente (Gato, Cat, Gato)  
✅ Calendário traduzido em todos idiomas  
✅ Capitalização brasileira correta sem CSS forçado  
✅ Cupons e validações traduzidos

---

## 📦 Commits Realizados

```
commit e333f84
fix: corrige textos hardcoded que não respeitavam idioma

7 arquivos modificados
38 inserções, 11 remoções
```

---

**Data:** 8 de fevereiro de 2026  
**Status:** ✅ Concluído
