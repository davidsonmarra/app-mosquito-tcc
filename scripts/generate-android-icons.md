# Guia para Substituir Ícones do Android

## Pré-requisitos
1. Tenha uma imagem do ícone em formato PNG, 1024x1024 pixels
2. A imagem deve ter fundo transparente
3. O ícone deve estar centralizado com margem de segurança (cerca de 20% de cada lado)

## Opção 1: Usar ferramenta online (Recomendado)

1. Acesse: https://icon.kitchen/ ou https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Faça upload da sua imagem (1024x1024px)
3. Configure:
   - Background: #FFFFFF (branco)
   - Foreground: Sua imagem do balde
4. Baixe o pacote gerado
5. Extraia e copie os arquivos para as pastas correspondentes

## Opção 2: Usar Android Asset Studio (via Android Studio)

1. Abra Android Studio
2. Vá em: File > New > Image Asset
3. Selecione "Launcher Icons (Adaptive and Legacy)"
4. Configure:
   - Foreground Layer: Sua imagem
   - Background Layer: Cor #FFFFFF
5. Clique em Next e depois Finish
6. Os arquivos serão gerados automaticamente

## Densidades necessárias:

- **mipmap-mdpi**: 48x48px (foreground: 108x108px)
- **mipmap-hdpi**: 72x72px (foreground: 162x162px)
- **mipmap-xhdpi**: 96x96px (foreground: 216x216px)
- **mipmap-xxhdpi**: 144x144px (foreground: 324x324px)
- **mipmap-xxxhdpi**: 192x192px (foreground: 432x432px)

## Estrutura de arquivos:

Após gerar, você precisa substituir:
- `android/app/src/main/res/mipmap-*/ic_launcher_foreground.webp` (5 arquivos)
- `android/app/src/main/res/mipmap-*/ic_launcher.webp` (5 arquivos)
- `android/app/src/main/res/mipmap-*/ic_launcher_round.webp` (5 arquivos)



