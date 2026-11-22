import { spawn } from 'node:child_process';

/**
 * Runs the Express API and the Vite dev server together, so `npm run dev`
 * gives you the same origin the browser sees in production (/api is proxied).
 */
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const children = [
  spawn(npm, ['run', 'dev:api'], { stdio: 'inherit' }),
  spawn(npm, ['run', 'dev:web'], { stdio: 'inherit' }),
];

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }

  setTimeout(() => process.exit(code), 400);
}

for (const child of children) {
  child.on('exit', (code) => {
    if (shuttingDown) return;
    console.error(`[dev] a process exited with code ${code ?? 0} — stopping both.`);
    shutdown(code ?? 1);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
