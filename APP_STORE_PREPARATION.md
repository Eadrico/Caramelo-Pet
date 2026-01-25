# Preparação para App Store - Caramelo

## ✅ Problemas Críticos Corrigidos

### 1. Bundle Identifier e Nome do App
- ✅ **Alterado de**: `com.placeholder.appid` e "vibecode"
- ✅ **Alterado para**: `com.caramelo.petcare` e "Caramelo"
- **Arquivo**: `app.json`

### 2. Descrições de Permissões
- ✅ Descrições customizadas e específicas para:
  - **NSPhotoLibraryUsageDescription**: Explica que é para adicionar fotos dos pets
  - **NSCameraUsageDescription**: Explica que é para tirar fotos dos pets
  - **NSPhotoLibraryAddUsageDescription**: Explica que é para salvar fotos
  - **NSUserNotificationsUsageDescription**: Explica que é para lembretes de cuidados

### 3. Console.log em Produção
- ✅ Removidos todos os `console.error` e `console.log` do arquivo `src/lib/storage.ts`
- Erros agora são tratados silenciosamente ou propagados sem logs

### 4. NSAllowsArbitraryLoads
- ✅ Configurado para `false` (mais seguro)
- App usa apenas armazenamento local, não precisa de conexões HTTP não seguras

### 5. Assets de Desenvolvimento
- ✅ Removidos screenshots e fotos de teste:
  - Screenshot 12:22:04.png
  - Screenshot 13:31:07.png
  - Fotos de pets de teste (Baunilha, Brownie, Fubá, Loki)
  - Arquivos temporários (create_splash.html)

---

## ⚠️ Ações Necessárias Antes de Publicar

### 1. Ícone do App (CRÍTICO)
**Status**: Ícone atual tem 1.7MB - muito grande!

**Você precisa**:
1. Ir na aba **IMAGES** do Vibecode
2. Criar ou fazer upload de um ícone otimizado:
   - Tamanho: 1024x1024 pixels
   - Formato: PNG sem transparência
   - Tamanho do arquivo: < 200KB (idealmente 50-100KB)
   - Tema sugerido: Uma pata de cachorro/gato na cor caramelo (#C4A77D) em fundo claro (#F5F2EE)
3. Substituir o arquivo `assets/icon.png`

**Comando para verificar tamanho**:
```bash
ls -lh assets/icon.png
```

### 2. Splash Screen (RECOMENDADO)
**Status**: Usando apenas cor de fundo

**Você precisa**:
1. Criar uma tela de abertura simples:
   - Tamanho: 1284x2778 pixels (iPhone 15 Pro Max)
   - Fundo: #F5F2EE (cor do app)
   - Logo/ícone centralizado
   - Texto "Caramelo" abaixo
2. Salvar como `assets/splash.png`
3. Adicionar no app.json:
   ```json
   "splash": {
     "image": "./assets/splash.png",
     "resizeMode": "contain",
     "backgroundColor": "#F5F2EE"
   }
   ```

### 3. Adaptive Icon Android (SE FOR PUBLICAR NO ANDROID)
**Status**: Apenas cor de fundo configurada

**Você precisa**:
1. Criar ícone adaptativo para Android:
   - Tamanho: 1024x1024 pixels
   - Apenas o ícone/logo (sem fundo)
   - Formato: PNG com transparência
2. Salvar como `assets/adaptive-icon.png`
3. Adicionar no app.json:
   ```json
   "android": {
     "adaptiveIcon": {
       "foregroundImage": "./assets/adaptive-icon.png",
       "backgroundColor": "#F5F2EE"
     }
   }
   ```

---

## 📝 Informações Importantes

### Bundle Identifiers Configurados
- **iOS**: `com.caramelo.petcare`
- **Android**: `com.caramelo.petcare`

### Nome do App
- **Display Name**: Caramelo
- **Slug**: caramelo-pet-care
- **URL Scheme**: caramelo://

### Versão
- **Version**: 1.0.0
- **Build Number**: 1

---

## 🚀 Próximos Passos para Publicação

1. ✅ Corrigir ícone (substituir icon.png otimizado)
2. ✅ Criar splash screen (opcional mas recomendado)
3. ✅ Testar o app no dispositivo físico
4. ✅ Ir no canto superior direito do Vibecode
5. ✅ Clicar em "Share"
6. ✅ Selecionar "Submit to App Store"
7. ✅ Seguir as instruções do assistente

---

## 📱 Informações Adicionais para App Store Connect

Quando for publicar, você precisará preencher no App Store Connect:

### Metadados Obrigatórios
- **Categoria**: Lifestyle ou Utilities
- **Descrição**: Texto descritivo sobre o app (até 4000 caracteres)
- **Keywords**: caramelo, pet, cuidado, animais, lembretes, vacina, cachorro, gato
- **Screenshots**: 3-5 capturas de tela do app em funcionamento

### Informações de Privacidade
- ✅ O app coleta dados localmente (AsyncStorage)
- ✅ O app solicita permissões: Câmera, Fotos, Notificações
- ✅ Nenhum dado é compartilhado com terceiros
- ✅ Todos os dados ficam no dispositivo do usuário

### Contato
- Email de suporte
- URL do site (opcional)
- Política de privacidade (recomendado criar uma)

---

## ✨ Melhorias Implementadas

- 🎨 Interface seguindo Apple Human Interface Guidelines
- 🌍 Suporte a 5 idiomas (EN, PT, ES, FR, ZH)
- 🔔 Notificações locais para lembretes
- 📸 Integração com câmera e galeria
- 💾 Armazenamento 100% local
- 🎭 Suporte a modo escuro
- ♿ Acessibilidade com traduções

---

Boa sorte com a publicação! 🚀
