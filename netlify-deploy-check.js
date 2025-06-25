// Script para verificar se o deploy está correto
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando arquivos para deploy...\n');

// Verificar se existe index.html na pasta dist
const distPath = path.join(process.cwd(), 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(distPath)) {
  console.log('❌ Pasta "dist" não encontrada. Execute: npm run build');
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.log('❌ index.html não encontrado na pasta dist');
  process.exit(1);
}

// Verificar conteúdo do index.html
const indexContent = fs.readFileSync(indexPath, 'utf8');

console.log('📄 Verificando index.html...');

if (indexContent.includes('Sistema de Estágios')) {
  console.log('✅ Título correto encontrado: "Sistema de Estágios"');
} else {
  console.log('❌ Título incorreto ou não encontrado');
}

if (indexContent.includes('main.jsx') || indexContent.includes('main.js')) {
  console.log('✅ Script principal encontrado');
} else {
  console.log('❌ Script principal não encontrado');
}

// Verificar se existem assets CSS/JS
const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  const assets = fs.readdirSync(assetsPath);
  const cssFiles = assets.filter(file => file.endsWith('.css'));
  const jsFiles = assets.filter(file => file.endsWith('.js'));
  
  console.log(`✅ Assets encontrados: ${cssFiles.length} CSS, ${jsFiles.length} JS`);
} else {
  console.log('❌ Pasta assets não encontrada');
}

console.log('\n🚀 Deploy pronto! Agora:');
console.log('1. Vá ao Netlify');
console.log('2. Faça deploy manual da pasta "dist"');
console.log('3. Ou reconecte o repositório');