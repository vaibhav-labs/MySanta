const fs = require('fs');
const path = require('path');

const files = [
  'app/api/lists/route.ts',
  'app/api/lists/[listId]/route.ts',
  'app/api/lists/[listId]/items/route.ts',
  'app/api/admin/users/[userId]/route.ts',
  'app/api/scrape/route.ts',
  'app/api/social/invite-bulk/route.ts',
  'app/api/social/friends/route.ts',
  'app/api/social/friends/[friendshipId]/route.ts',
  'app/api/items/[itemId]/route.ts',
  'app/api/items/[itemId]/purchase/route.ts',
  'app/api/items/[itemId]/hold/route.ts',
  'app/api/items/[itemId]/block/route.ts'
];

files.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if dynamic export already exists
    if (!content.includes('export const dynamic')) {
      // Find the last import line
      const lines = content.split('\n');
      let lastImportIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          lastImportIndex = i;
        }
      }
      
      if (lastImportIndex !== -1) {
        // Insert dynamic export after last import
        lines.splice(lastImportIndex + 1, 0, '', 'export const dynamic = \'force-dynamic\'');
        content = lines.join('\n');
        
        fs.writeFileSync(fullPath, content);
        console.log(`Added dynamic export to: ${filePath}`);
      }
    } else {
      console.log(`Dynamic export already exists in: ${filePath}`);
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Done adding dynamic exports!');