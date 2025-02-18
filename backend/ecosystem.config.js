module.exports = {
  apps: [{
    name: 'ai-edu-api',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true
  }],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'your-repository-url',
      path: '/var/www/aiedu',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
