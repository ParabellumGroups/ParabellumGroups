module.exports = {
  apps: [{
    name: 'parabellum-api',
    script: 'dist/index.js',
    cwd: '/var/www/parabellum-groups/Back-end',
    instances: 'max',
    exec_mode: 'cluster',
    
    // Variables d'environnement
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    
    // Logs
    error_file: '/var/log/pm2/parabellum-error.log',
    out_file: '/var/log/pm2/parabellum-out.log',
    log_file: '/var/log/pm2/parabellum-combined.log',
    time: true,
    
    // Performance
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    
    // Monitoring
    min_uptime: '10s',
    max_restarts: 10,
    
    // Graceful reload
    kill_timeout: 5000,
    listen_timeout: 8000,
    
    // Watch (désactivé en production)
    watch: false,
    ignore_watch: [
      'node_modules',
      'logs',
      'uploads'
    ],
    
    // Clustering
    instance_var: 'INSTANCE_ID',
    
    // Auto restart
    autorestart: true,
    
    // Cron restart (optionnel - redémarrage hebdomadaire)
    cron_restart: '0 4 * * 0'
  }],
  
  // Configuration de déploiement
  deploy: {
    production: {
      user: 'deploy',
      host: 'votre-serveur.com',
      ref: 'origin/main',
      repo: 'git@github.com:votre-org/parabellum-groups.git',
      path: '/var/www/parabellum-groups',
      'post-deploy': 'cd Back-end && npm install && npx prisma generate && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    }
  }
};