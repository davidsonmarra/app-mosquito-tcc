/**
 * Script para gerar ícones do Android em diferentes densidades
 * 
 * Uso:
 * 1. Coloque sua imagem do ícone (1024x1024px) em: assets/images/icon-source.png
 * 2. Execute: node scripts/generate-android-icons.js
 * 
 * Requer: sharp (npm install --save-dev sharp)
 */

const fs = require('fs');
const path = require('path');

// Densidades do Android
const densities = {
  'mdpi': { size: 48, foreground: 108 },
  'hdpi': { size: 72, foreground: 162 },
  'xhdpi': { size: 96, foreground: 216 },
  'xxhdpi': { size: 144, foreground: 324 },
  'xxxhdpi': { size: 192, foreground: 432 }
};

const sourceImage = path.join(__dirname, '../assets/images/icon-source.png');
const androidResPath = path.join(__dirname, '../android/app/src/main/res');

console.log('🔧 Gerador de Ícones Android\n');

// Verificar se a imagem fonte existe
if (!fs.existsSync(sourceImage)) {
  console.error('❌ Erro: Imagem fonte não encontrada!');
  console.error(`   Coloque sua imagem em: ${sourceImage}`);
  console.error('   A imagem deve ser PNG, 1024x1024 pixels, com fundo transparente.\n');
  process.exit(1);
}

// Verificar se sharp está instalado
try {
  require('sharp');
} catch (e) {
  console.error('❌ Erro: A biblioteca "sharp" não está instalada!');
  console.error('   Execute: npm install --save-dev sharp\n');
  process.exit(1);
}

const sharp = require('sharp');

async function generateIcons() {
  console.log('📦 Gerando ícones...\n');

  try {
    for (const [density, config] of Object.entries(densities)) {
      const mipmapPath = path.join(androidResPath, `mipmap-${density}`);
      
      // Criar diretório se não existir
      if (!fs.existsSync(mipmapPath)) {
        fs.mkdirSync(mipmapPath, { recursive: true });
      }

      // Gerar foreground (ícone centralizado)
      const foregroundPath = path.join(mipmapPath, 'ic_launcher_foreground.webp');
      await sharp(sourceImage)
        .resize(config.foreground, config.foreground, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .webp({ quality: 100 })
        .toFile(foregroundPath);
      
      console.log(`✅ ${density}: ic_launcher_foreground.webp (${config.foreground}x${config.foreground})`);

      // Gerar ícone completo (foreground + background branco)
      const iconPath = path.join(mipmapPath, 'ic_launcher.webp');
      await sharp({
        create: {
          width: config.foreground,
          height: config.foreground,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .composite([{
          input: await sharp(sourceImage)
            .resize(config.foreground, config.foreground, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toBuffer()
        }])
        .webp({ quality: 100 })
        .toFile(iconPath);
      
      console.log(`✅ ${density}: ic_launcher.webp (${config.foreground}x${config.foreground})`);

      // Gerar ícone round (mesmo que o normal para Android)
      const roundPath = path.join(mipmapPath, 'ic_launcher_round.webp');
      fs.copyFileSync(iconPath, roundPath);
      console.log(`✅ ${density}: ic_launcher_round.webp (cópia)\n`);
    }

    console.log('✨ Ícones gerados com sucesso!');
    console.log('📱 Agora você pode compilar o app Android.\n');
    
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error.message);
    process.exit(1);
  }
}

generateIcons();



