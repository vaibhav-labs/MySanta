const fs = require('fs');
const path = require('path');

function fixComplexQueries(content) {
  // Remove complex includes from findById calls
  content = content.replace(/\.findById\(\{[\s\S]*?include:[\s\S]*?\}\)/g, (match) => {
    // Extract the ID parameter
    const idMatch = match.match(/id:\s*([^,}]+)/);
    if (idMatch) {
      return `.findById(${idMatch[1].trim()})`;
    }
    return match;
  });
  
  // Fix remaining findById with where clause
  content = content.replace(/\.findById\(\s*{\s*where:\s*{\s*id:\s*([^}]+)\s*}\s*}\s*\)/g, '.findById($1)');
  
  // Fix listItem.update calls
  content = content.replace(/db\.listItem\.update\(\s*{\s*where:\s*{\s*id:\s*([^}]+)\s*},\s*data:\s*({[^}]+})\s*}\s*\)/g, 'db.listItem.update($1, $2)');
  
  // Fix list.update calls  
  content = content.replace(/db\.list\.update\(\s*{\s*where:\s*{\s*id:\s*([^}]+)\s*},\s*data:\s*({[^}]+})\s*}\s*\)/g, 'db.list.update($1, $2)');
  
  // Fix friendship.update calls
  content = content.replace(/db\.friendship\.update\(\s*{\s*where:\s*{\s*id:\s*([^}]+)\s*},\s*data:\s*({[^}]+})\s*}\s*\)/g, 'db.friendship.update($1, $2)');
  
  return content;
}

const filesToFix = [
  'app/api/items/[itemId]/route.ts',
  'app/api/items/[itemId]/hold/route.ts',
  'app/api/items/[itemId]/purchase/route.ts',
  'app/api/lists/[listId]/route.ts',
  'app/api/social/friends/[friendshipId]/route.ts'
];

filesToFix.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = fixComplexQueries(content);
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${file}`);
  }
});

console.log('Done fixing complex queries!');