const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'app', 'api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix findById with where clause
  content = content.replace(/\.findById\({\s*where:\s*{\s*id:\s*([^}]+)\s*}[^}]*}\)/g, '.findById($1)');
  
  // Fix findUnique to findById
  content = content.replace(/\.findUnique\(/g, '.findById(');
  
  // Fix db.listItem.create with nested data
  content = content.replace(/db\.listItem\.create\({\s*data:/g, 'db.listItem.create(');
  
  // Fix db.list.create with nested data
  content = content.replace(/db\.list\.create\({\s*data:/g, 'db.list.create(');
  
  // Fix db.event.create with nested data
  content = content.replace(/db\.event\.create\({\s*data:/g, 'db.event.create(');
  
  // Fix db.feedback.create with nested data
  content = content.replace(/db\.feedback\.create\({\s*data:/g, 'db.feedback.create(');
  
  // Fix db.user.update with where clause
  content = content.replace(/db\.user\.update\({\s*where:\s*{\s*id:\s*([^}]+)\s*},\s*data:\s*([^}]+)}\)/g, 'db.user.update($1, $2)');
  
  // Fix db.listItem.update with where clause
  content = content.replace(/db\.listItem\.update\({\s*where:\s*{\s*id:\s*([^}]+)\s*},\s*data:\s*([^}]+)}\)/g, 'db.listItem.update($1, $2)');
  
  // Fix count method calls
  content = content.replace(/db\.\w+\.count\(\)/g, function(match) {
    return match.replace('.count()', '.findMany()');
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fixFile(fullPath);
    }
  });
}

walkDir(apiDir);
console.log('All API files fixed!');