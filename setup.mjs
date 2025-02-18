import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupProject() {
  try {
    console.log('🚀 开始初始化AI教育平台...');

    // 1. 创建目录结构
    const dirs = [
      'frontend/src/components',
      'frontend/src/views',
      'frontend/src/router',
      'frontend/src/store',
      'frontend/src/assets',
      'frontend/public',
      'backend/src/controllers',
      'backend/src/models',
      'backend/src/routes',
      'backend/src/services',
      'backend/config',
      'docs',
      'logs'
    ];

    for (const dir of dirs) {
      await fs.mkdir(join(__dirname, dir), { recursive: true });
      console.log(`✓ 创建目录: ${dir}`);
    }

    // 2. 创建必要的配置文件
    const configFiles = {
      'package.json': {
        name: 'ai-education-platform',
        version: '1.0.0',
        private: true,
        workspaces: ['frontend', 'backend'],
        scripts: {
          "dev:frontend": "cd frontend && npm run dev",
          "dev:backend": "cd backend && npm run dev",
          "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install"
        }
      },
      'frontend/package.json': {
        name: 'ai-edu-frontend',
        version: '1.0.0',
        private: true,
        scripts: {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
        dependencies: {
          "vue": "^3.3.0",
          "vue-router": "^4.2.0",
          "pinia": "^2.1.0",
          "element-plus": "^2.3.0",
          "axios": "^1.6.0"
        },
        devDependencies: {
          "@vitejs/plugin-vue": "^4.5.0",
          "vite": "^5.0.0"
        }
      },
      'backend/package.json': {
        name: 'ai-edu-backend',
        version: '1.0.0',
        private: true,
        type: "module",
        scripts: {
          "dev": "nodemon src/app.js",
          "start": "node src/app.js"
        },
        dependencies: {
          "express": "^4.18.0",
          "mongoose": "^7.0.0",
          "cors": "^2.8.5",
          "dotenv": "^16.0.0"
        },
        devDependencies: {
          "nodemon": "^3.0.0"
        }
      },
      '.env': `PORT=3000\nMONGODB_URI=mongodb://localhost:27017/ai_education\nJWT_SECRET=your-secret-key\nNODE_ENV=development`,
      '.gitignore': 'node_modules/\n.env\n.DS_Store\ndist/\n.vscode/'
    };

    for (const [file, content] of Object.entries(configFiles)) {
      await fs.writeFile(
        join(__dirname, file),
        typeof content === 'string' ? content : JSON.stringify(content, null, 2)
      );
      console.log(`✓ 创建文件: ${file}`);
    }

    console.log('\n✅ 项目基础结构创建完成！');
    
    console.log('\n📦 开始安装依赖...');
    await execAsync('npm install', { stdio: 'inherit' });

    console.log('\n🎉 初始化完成！\n');
    console.log('接下来请运行：');
    console.log('1. cd frontend');
    console.log('2. npm run dev');
    console.log('\n在另一个终端运行：');
    console.log('1. cd backend');
    console.log('2. npm run dev');

  } catch (error) {
    console.error('❌ 项目初始化失败:', error);
    process.exit(1);
  }
}

setupProject();
