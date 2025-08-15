// scripts/generate-postman.js
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname as pathDirname, posix } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// --- ESM __dirname/__filename polyfill ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
// -----------------------------------------

const rootDir = join(__dirname, '..');
const routesDir = join(rootDir, 'backend', 'src', 'routes');
const outputDir = join(rootDir, 'postman');
const outputFile = join(outputDir, 'h2go-postman-import.json');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

function getDefaultValue(name) {
  const map = {
    confirmation_token: '{{confirmation_token}}',
    confirmation_token_type: '{{confirmation_token_type}}',
    confirmation_token_expiry_date: '{{confirmation_token_expiry_date}}',
    one_time_pin: '{{otp}}',
    refresh_token: '{{refresh_token}}',
    access_token: '{{access_token}}',
  };
  return map[name] || '';
}

function extractRequestParts(controllerPath, methodName) {
  const result = { body: {}, query: {} };
  try {
    const content = readFileSync(controllerPath, 'utf8');
    const start = content.indexOf(`static ${methodName}`);
    if (start === -1) return result;
    let bodyStart = content.indexOf('{', start);
    if (bodyStart === -1) return result;
    let depth = 1;
    let pos = bodyStart + 1;
    while (pos < content.length && depth > 0) {
      if (content[pos] === '{') depth++;
      else if (content[pos] === '}') depth--;
      pos++;
    }
    const block = content.substring(bodyStart + 1, pos - 1);
    const extract = (regex, target) => {
      let m;
      while ((m = regex.exec(block)) !== null) {
        if (m[1]) {
          const fields = m[1].split(',').map(f => f.trim().split(':')[0].trim());
          fields.forEach(field => {
            target[field] = getDefaultValue(field);
          });
        } else if (m[2]) {
          const field = m[2].trim();
          target[field] = getDefaultValue(field);
        }
      }
    };
    // match destructures and direct property access
    extract(/(?:const|let|var)\s*{\s*([^}]+)\s*}\s*=\s*req\.body/g, result.body);
    extract(/(?:req\.body\.)([A-Za-z0-9_]+)/g, result.body);
    extract(/(?:const|let|var)\s*{\s*([^}]+)\s*}\s*=\s*req\.query/g, result.query);
    extract(/(?:req\.query\.)([A-Za-z0-9_]+)/g, result.query);
    return result;
  } catch {
    return result;
  }
}

function parseRouteFile(filePath, urlPrefix) {
  const content = readFileSync(filePath, 'utf8');

  // capture named import (one symbol) -> path
  const importRegex = /import\s+{\s*([A-Za-z0-9_]+)\s*}\s+from\s+["']([^"']+)["']/g;
  const imports = {};
  let im;
  while ((im = importRegex.exec(content)) !== null) {
    imports[im[1]] = im[2];
  }

  // router.METHOD("path", ..., Controller.method)
  const routeRegex = /router\.(get|post|put|delete|patch)\(\s*["']([^"']+)["']([^)]*)\)/g;
  const items = [];
  let match;

  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const pathSuffix = match[2];

    const handlers = match[3]
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const lastHandler = handlers[handlers.length - 1] || '';
    const [controllerClass, controllerMethod] = lastHandler.split('.');
    const controllerImport = imports[controllerClass];
    const controllerPath = controllerImport
      ? resolve(pathDirname(filePath), controllerImport + '.ts')
      : null;

    const { body, query } = controllerPath
      ? extractRequestParts(controllerPath, controllerMethod)
      : { body: {}, query: {} };

    const urlPathRaw = posix.join(urlPrefix, pathSuffix);
    const paramMatches = [];
    const urlPath = urlPathRaw.replace(/:([A-Za-z0-9_]+)/g, (_, p1) => {
      paramMatches.push({ key: p1, value: '' });
      return `{{${p1}}}`;
    });

    const requiresAuth = handlers.includes('restricted');
    const headers = requiresAuth
      ? [{ key: 'Authorization', value: 'Bearer {{access_token}}' }]
      : [];

    const req = {
      name: `${method} ${urlPath}`,
      request: {
        method,
        header: headers,
        url: {
          raw: `{{baseUrl}}${urlPath}`,
          host: ['{{baseUrl}}'],
          path: urlPath.split('/').filter(Boolean),
        },
      },
    };

    if (paramMatches.length > 0) {
      req.request.url.variable = paramMatches;
    }
    if (Object.keys(query).length > 0) {
      req.request.url.query = Object.entries(query).map(([k, v]) => ({
        key: k,
        value: v,
      }));
    }
    if (Object.keys(body).length > 0) {
      req.request.body = {
        mode: 'raw',
        raw: JSON.stringify(body, null, 2),
        options: { raw: { language: 'json' } },
      };
    }

    // auth-specific tests
    if (controllerClass === 'AuthController') {
      let tests = [];
      if (['login', 'passwordForgot'].includes(controllerMethod)) {
        tests = [
          'const json = pm.response.json();',
          'if (json.data.confirmation_token) pm.environment.set("confirmation_token", json.data.confirmation_token);',
          'if (json.data.confirmation_token_type) pm.environment.set("confirmation_token_type", json.data.confirmation_token_type);',
          'if (json.data.confirmation_token_expiry_date) pm.environment.set("confirmation_token_expiry_date", json.data.confirmation_token_expiry_date);',
          'if (json.data.otp) pm.environment.set("otp", json.data.otp);',
        ];
      } else if (['oneTimePin', 'passwordReset', 'refreshToken'].includes(controllerMethod)) {
        tests = [
          'const json = pm.response.json();',
          'if (json.data.access_token) pm.environment.set("access_token", json.data.access_token);',
          'if (json.data.refresh_token) pm.environment.set("refresh_token", json.data.refresh_token);',
          'if (json.data.confirmation_token) pm.environment.set("confirmation_token", json.data.confirmation_token);',
          'if (json.data.confirmation_token_type) pm.environment.set("confirmation_token_type", json.data.confirmation_token_type);',
          'if (json.data.confirmation_token_expiry_date) pm.environment.set("confirmation_token_expiry_date", json.data.confirmation_token_expiry_date);',
          'if (json.data.otp) pm.environment.set("otp", json.data.otp);',
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
  const entries = readdirSync(dir, { withFileTypes: true });
  const items = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = walk(full, posix.join(urlPrefix, entry.name));
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
  item: walk(join(routesDir, 'api', 'v1'), '/api/v1'),
  variable: [{ key: 'baseUrl', value: 'http://localhost:3000' }],
};

writeFileSync(outputFile, JSON.stringify(collection, null, 2));
console.log(`Postman collection generated at ${outputFile}`);
