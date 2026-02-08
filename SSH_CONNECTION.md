# Conexão SSH do App Vibecode

Este documento descreve a conexão SSH estabelecida com o servidor do app Vibecode.

## Credenciais de Conexão

- **Host:** `019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io`
- **Porta:** `2222`
- **Usuário:** `vibecode`
- **Senha:** `unwanted-owl-seminar-profusely-nimble`

## Comando de Conexão

```bash
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io
```

Ou sem sshpass (entrada manual de senha):

```bash
ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io
```

## Estrutura do Servidor

```
/home/user/
├── workspace/              # Projeto principal
│   ├── mobile/            # App React Native (Expo + NativeWind)
│   ├── backend/           # Backend do projeto
│   └── changelog.txt
├── workspace-mobile/
├── workspace-webapp/
└── workspace-website/
```

## Diretório do App Mobile

O código do app mobile está localizado em:
```
/home/user/workspace/mobile
```

### Arquivos Importantes

- `expo.log` - Logs do servidor Expo
- `.env` - Variáveis de ambiente
- `src/app/` - Estrutura de rotas do Expo Router
- `src/components/` - Componentes reutilizáveis
- `src/lib/` - Utilitários e stores

## Status do Servidor

### Processos Ativos

- ✅ **Expo Dev Server** - Porta 8081
- ✅ **Metro Bundler** - Empacotador JavaScript
- ✅ **Bun Hot Reload** - Servidor de desenvolvimento com hot reload
- ✅ **NativeWind/Tailwind** - Processamento de estilos

### Verificar Logs

```bash
# Ver logs do Expo
ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && tail -f expo.log"

# Ver processos ativos
ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "ps aux | grep -E '(expo|node|metro)' | grep -v grep"
```

## Estrutura do App

### Rotas (Expo Router)

```
src/app/
├── _layout.tsx              # Layout raiz
├── (tabs)/                  # Rotas com tabs
│   ├── _layout.tsx         # Layout das tabs
│   ├── index.tsx           # Tab principal
│   └── settings.tsx        # Tab de configurações
├── onboarding.tsx          # Tela de onboarding
├── +html.tsx               # Template HTML
└── +not-found.tsx          # Página 404
```

### Componentes

```
src/components/
├── AddCareItemSheet.tsx
├── AddItemSelector.tsx
├── AddPetWizard.tsx
├── AddReminderSheet.tsx
├── HomeScreen.tsx
├── IntroView.tsx
├── OnboardingFlow.tsx
├── OnboardingWizard.tsx
├── PaywallScreen.tsx
├── PetChip.tsx
├── PetDetailScreen.tsx
├── Themed.tsx
├── design-system.tsx
├── home/
│   ├── CareItemRow.tsx
│   ├── PetCard.tsx
│   └── ReminderRow.tsx
└── onboarding/
    ├── OnboardingBasics.tsx
    ├── OnboardingCare.tsx
    ├── OnboardingInfo.tsx
    ├── OnboardingPhoto.tsx
    └── OnboardingReview.tsx
```

## Stack Tecnológica

- **Framework:** Expo SDK 53 + React Native 0.76.7
- **Gerenciador de Pacotes:** Bun
- **Roteamento:** Expo Router (file-based)
- **Estilização:** NativeWind + Tailwind v3
- **Animações:** react-native-reanimated v3
- **Gestos:** react-native-gesture-handler
- **Ícones:** lucide-react-native
- **Estado:** React Query + Zustand
- **Monetização:** RevenueCat

## Comandos Úteis

### Executar comandos no servidor

```bash
# Comando genérico
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && [SEU_COMANDO]"

# Exemplos:
# Ver variáveis de ambiente
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && cat .env"

# Listar dependências
sshpass -p 'unwanted-owl-seminar-profusely-nimble' ssh -p 2222 vibecode@019b3c58-3269-7708-b5ff-6eb362d545a7.vibecodeapp.io "cd /home/user/workspace/mobile && bun list"
```

## Observações

- O servidor Expo roda automaticamente via `runsv` (runit service)
- Os logs são redirecionados para `/var/log/expo/`
- Hot reload está ativo através do Bun
- O servidor está configurado para `--localhost` (acesso local apenas)

## Data de Criação

8 de fevereiro de 2026
