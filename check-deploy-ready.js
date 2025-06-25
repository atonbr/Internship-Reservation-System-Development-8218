// Script para verificar se está tudo pronto para deploy
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando se projeto está pronto para Netlify...\n');

// Lista de verificações
const checks = [
  {
    name: 'package.json existe',
    check: () => fs.existsSync('package.json'),
    fix: 'Arquivo package.json não encontrado!'
  },
  {
    name: 'netlify.toml existe',
    check: () => fs.existsSync('netlify.toml'),
    fix: 'Arquivo netlify.toml não encontrado!'
  },
  {
    name: 'index.html tem título correto',
    check: () => {
      if (!fs.existsSync('index.html')) return false;
      const content = fs.readFileSync('index.html', 'utf8');
      return content.includes('Sistema de Estágios');
    },
    fix: 'Título no index.html deve ser "Sistema de Estágios"'
  },
  {
    name: 'Scripts de build configurados',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.scripts && pkg.scripts.build;
    },
    fix: 'Script "build" não encontrado no package.json'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${check.name}`);
  
  if (!passed) {
    console.log(`   💡 ${check.fix}\n`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 PROJETO PRONTO PARA NETLIFY!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Acesse https://www.netlify.com');
  console.log('2. Faça login com GitHub/GitLab');
  console.log('3. Clique "Add new site" → "Import existing project"');
  console.log('4. Selecione seu repositório');
  console.log('5. Configure: Build = "npm run build", Publish = "dist"');
} else {
  console.log('❌ PROBLEMAS ENCONTRADOS!');
  console.log('Corrija os problemas acima antes de fazer deploy.');
}

console.log('\n🆘 Se tiver problemas:');
console.log('- Use deploy manual: npm run build + upload da pasta "dist"');
console.log('- Ou entre em contato para ajuda');