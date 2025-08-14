const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'backend', 'src', 'routes');

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, fileList);
    } else if (entry.isFile() && entry.name.endsWith('.route.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const files = walk(routesDir);

const collection = {
  info: {
    name: 'H2GO API',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  item: []
};

const host = '{{baseUrl}}';

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const relativeDir = path.relative(routesDir, dir);
  const basePath = '/' + relativeDir.split(path.sep).join('/');
  const groupName = capitalize(relativeDir.split(path.sep).pop());
  const group = { name: groupName, item: [] };

  const regex = /router\.(get|post|put|patch|delete|options|head)\(\s*['"`]([^'"`]+)['"`]/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const routePath = match[2];
    const fullPath = basePath + routePath;
    const url = {
      raw: host + fullPath,
      host: [host],
      path: fullPath.split('/').filter(Boolean)
    };
    group.item.push({
      name: `${method} ${fullPath}`,
      request: { method, url }
    });
  }
  collection.item.push(group);
}

fs.writeFileSync(path.join(__dirname, '..', 'postman_collection.json'), JSON.stringify(collection, null, 2));
