# Configuração de Variáveis de Ambiente

## 🔑 Google Maps API Key

Para usar o Google Maps no app, você precisa configurar sua API key em um arquivo de ambiente.

### 📝 Passos:

1. **Crie o arquivo `.env` na raiz do projeto:**

   ```bash
   touch .env
   ```

2. **Adicione sua API key no arquivo `.env`:**

   ```env
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_api_key_aqui
   ```

3. **Substitua `sua_api_key_aqui` pela sua chave real do Google Maps**

### 🔒 Segurança:

- ✅ O arquivo `.env` está no `.gitignore` (não será commitado)
- ✅ Nunca commite sua API key real
- ✅ Use apenas em desenvolvimento local

### 🚀 Como Obter a API Key:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione um existente
3. Ative as APIs necessárias:
   - Geocoding API
   - Maps JavaScript API
4. Crie uma credencial (API Key)
5. Configure restrições de uso (recomendado)

### ⚠️ Importante:

- A variável deve começar com `EXPO_PUBLIC_` para ser acessível no app
- Reinicie o servidor após criar/modificar o arquivo `.env`
- Teste se a API key está funcionando verificando os logs do console

### 🧪 Teste:

Após configurar, você deve ver no console:

```
🔑 API Key configurada: AIzaSyB3Hn...
✅ Coordenadas REAIS encontradas no Google Maps: {...}
```

Se não configurar, verá:

```
⚠️ API Key do Google Maps não configurada! Verifique o arquivo .env
```
