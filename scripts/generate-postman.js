const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const rootDir = path.join(__dirname, '..');
const routesDir = path.join(rootDir, 'backend', 'src', 'routes');
const outputDir = path.join(rootDir, 'postman');
const outputFile = path.join(outputDir, 'H2GO-Postman-Import.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function getDefaultValue(name) {
  const map = {
    confirmation_token: '{{confirmation_token}}',
    one_time_pin: '{{otp}}',
    refresh_token: '{{refresh_token}}',
    access_token: '{{access_token}}',
  };
  return map[name] || '';
}

function extractBody(controllerPath, methodName) {
  try {
    const content = fs.readFileSync(controllerPath, 'utf8');
    const start = content.indexOf(`static ${methodName}`);
    if (start === -1) return {};
    let bodyStart = content.indexOf('{', start);
    if (bodyStart === -1) return {};
    let depth = 1;
    let pos = bodyStart + 1;
    while (pos < content.length && depth > 0) {
      if (content[pos] === '{') depth++;
      else if (content[pos] === '}') depth--;
      pos++;
    }
    const bodyBlock = content.substring(bodyStart + 1, pos - 1);
    const destructureRegex = /const\s*{\s*([^}]+)\s*}\s*=\s*req\.body/;
    const d = destructureRegex.exec(bodyBlock);
    const body = {};
    if (d) {
      const fields = d[1].split(',').map(f => f.trim().split(':')[0].trim());
      fields.forEach(field => {
        body[field] = getDefaultValue(field);
      });
    }
    return body;
  } catch (err) {
    return {};
  }
}

function parseRouteFile(filePath, urlPrefix) {
  const content = fs.readFileSync(filePath, 'utf8');
  const importRegex = /import\s+{\s*([A-Za-z0-9_]+)\s*}\s+from\s+"([^\"]+)"/g;
  const imports = {};
  let im;
  while ((im = importRegex.exec(content)) !== null) {
    imports[im[1]] = im[2];
  }
  const routeRegex = /router\.(get|post|put|delete|patch)\("([^"]+)"\s*,\s*([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)/g;
  const items = [];
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const pathSuffix = match[2];
    const controllerClass = match[3];
    const controllerMethod = match[4];
    const controllerImport = imports[controllerClass];
    const controllerPath = controllerImport
      ? path.resolve(path.dirname(filePath), controllerImport + '.ts')
      : null;
    const body = controllerPath ? extractBody(controllerPath, controllerMethod) : {};

    const urlPath = path.posix.join(urlPrefix, pathSuffix);
    const req = {
      name: `${method} ${urlPath}`,
      request: {
        method,
        header: [],
        url: {
          raw: `{{baseUrl}}${urlPath}`,
          host: ['{{baseUrl}}'],
          path: urlPath.split('/').filter(Boolean),
        },
      },
    };
    if (Object.keys(body).length > 0) {
      req.request.body = {
        mode: 'raw',
        raw: JSON.stringify(body, null, 2),
        options: { raw: { language: 'json' } },
      };
    }

    // auth specific tests
    if (controllerClass === 'AuthController') {
      let tests = [];
      if (['login', 'passwordForgot'].includes(controllerMethod)) {
        tests = [
          'const json = pm.response.json();',
          'pm.environment.set("confirmation_token", json.data.confirmation_token);',
          'pm.environment.set("otp", json.data.otp);',
        ];
      } else if (['oneTimePin', 'passwordReset', 'refreshToken'].includes(controllerMethod)) {
        tests = [
          'const json = pm.response.json();',
          'pm.environment.set("access_token", json.data.access_token);',
          'pm.environment.set("refresh_token", json.data.refresh_token);',
        ];
      }
      if (tests.length > 0) {
        req.event = [
          {
            listen: 'test',
            script: {
              type: 'text/javascript',
              exec: tests,
            },
          },
        ];
      }
    }

    items.push(req);
  }
  return items;
}

function walk(dir, urlPrefix) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = walk(full, path.posix.join(urlPrefix, entry.name));
      if (sub.length > 0) {
        items.push({ name: entry.name, item: sub });
      }
    } else if (/\.route\.[tj]s$/.test(entry.name)) {
      const reqs = parseRouteFile(full, urlPrefix);
      items.push(...reqs);
    }
  }
  return items;
}

const collection = {
  info: {
    name: 'H2GO API',
    _postman_id: randomUUID(),
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: walk(path.join(routesDir, 'api', 'v1'), '/api/v1'),
  variable: [
    { key: 'baseUrl', value: 'http://localhost:3000' },
  ],
};

fs.writeFileSync(outputFile, JSON.stringify(collection, null, 2));
console.log(`Postman collection generated at ${outputFile}`);