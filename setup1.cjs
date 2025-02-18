const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

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

    dirs.forEach(dir => {
      fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
      console.log(`✓ 创建目录: ${dir}`);
    });

    // 2. 创建基础配置文件
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
      '.env': 'PORT=3000\nMONGODB_URI=mongodb://localhost:27017/ai_education\nJWT_SECRET=your-secret-key\nNODE_ENV=development',
      '.gitignore': 'node_modules/\n.env\n.DS_Store\ndist/\n.vscode/'
    };

    for (const [file, content] of Object.entries(configFiles)) {
      fs.writeFileSync(
        path.join(__dirname, file),
        typeof content === 'string' ? content : JSON.stringify(content, null, 2)
      );
      console.log(`✓ 创建文件: ${file}`);
    }

    console.log('\n✅ 基础结构创建完成！');

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

setupProject();
