import { createApp } from './app.js';
import { loadConfig, loadEnvFiles } from './lib/config.js';

loadEnvFiles();

const config = loadConfig();
const app = createApp({ config });

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`mash-folio API + site → http://0.0.0.0:${config.port}`);
  console.log(`  data dir: ${config.dataDir}`);
  console.log(`  admin: ${config.configured ? config.adminEmail : 'NOT CONFIGURED'}`);
  console.log(
    `  dist: ${config.distDir}${config.nodeEnv === 'production' ? '' : ' (served only if built)'}`
  );

  if (!config.configured) {
    console.warn(
      '\n  ⚠ Admin login is disabled. Add ADMIN_EMAIL and ADMIN_PASSWORD_HASH to .env.local\n' +
        '    Generate a hash with: npm run auth:hash -- "your-password"\n'
    );
  }
});

const shutdown = (signal) => {
  console.log(`\n${signal} received — closing server.`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
