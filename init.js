import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directories = [
  'frontend/src/components',
  'frontend/src/views',
  'frontend/src/router',
  'frontend/src/assets',
  'frontend/src/store',
  'backend/src/controllers',
  'backend/src/models',
  'backend/src/routes',
  'backend/src/services',
  'backend/config',
  'docs'
];

async function init() {
  try {
    for (const dir of directories) {
      const fullPath = join(__dirname, dir);
      await fs.mkdir(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
    
    // 创建基础配置文件
    await createConfigFiles();
    
    console.log('Project structure created successfully!');
  } catch (err) {
    console.error('Error creating project structure:', err);
  }
}

async function createConfigFiles() {
  // 创建 package.json
  const packageJson = {
    "name": "ai-education-platform",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev:frontend": "cd frontend && npm run dev",
      "dev:backend": "cd backend && npm run dev",
      "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install"
    }
  };

  // 创建 .env
  const envContent = `PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai_education
JWT_SECRET=your-secret-key
NODE_ENV=development`;

  // 创建 .gitignore
  const gitignoreContent = `node_modules/
.env
.DS_Store
dist/
.vscode/`;

  try {
    await fs.writeFile(join(__dirname, 'package.json'), JSON.stringify(packageJson, null, 2));
    await fs.writeFile(join(__dirname, '.env'), envContent);
    await fs.writeFile(join(__dirname, '.gitignore'), gitignoreContent);
  } catch (err) {
    console.error('Error creating config files:', err);
  }
}

init();
