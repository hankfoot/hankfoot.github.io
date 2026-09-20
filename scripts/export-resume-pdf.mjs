// Exports /resume to public/hank-duhaime-resume.pdf — the single PDF every
// resume link on the site points at.
//
// Why a script instead of a checked-in file: the PDF used to be made by hand,
// which meant the document and the site's own CV data could disagree and only a
// human comparing them would notice. Commit 8eb8f68 ("Ship the 2026 resume and
// reconcile the CV against it") was that reconciliation being done by hand. Now
// the page is the source and the PDF falls out of it, so the two cannot drift.
//
// No new dependency: this drives the Chrome already on the machine and Astro's
// own preview server. Chrome's print-to-PDF is the same engine a visitor gets
// from Cmd+P on /resume, so the downloaded file and the printed one match.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const OUT = resolve('public/hank-duhaime-resume.pdf');
// A preference, not a promise: `astro preview` falls back to the next free port
// when this one is taken and only says so on stdout, so the real port is read
// back from the server below rather than assumed here. Asking for a port and
// then printing the wrong one is how this script failed the first time.
const PREFERRED_PORT = 4399;

// Honour CHROME_PATH first so this works on a machine that keeps Chrome
// somewhere else, or wants to point at Chromium/Edge instead.
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find(p => existsSync(p));
if (!chrome) {
  console.error(
    '\n✗ No Chrome found, so the resume PDF cannot be exported.\n' +
    '  Install Google Chrome, or set CHROME_PATH to a Chromium-based browser.\n' +
    '  Looked in:\n' + CHROME_CANDIDATES.map(p => `    ${p}`).join('\n') + '\n'
  );
  process.exit(1);
}

const run = (cmd, args, label) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false });
  if (r.status !== 0) {
    console.error(`\n✗ ${label} failed.\n`);
    process.exit(r.status ?? 1);
  }
};

// Poll rather than sleep: the preview server is ready when it answers, and a
// fixed wait is either slower than it needs to be or occasionally too short.
const waitForServer = async (url, timeoutMs = 20000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise(r => setTimeout(r, 150));
  }
  return false;
};

console.log('▶ Building site…');
run('npx', ['astro', 'build'], 'astro build');

console.log('▶ Serving dist…');
const server = spawn('npx', ['astro', 'preview', '--port', String(PREFERRED_PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: false,
});

// Read the port Astro actually bound from its banner, rather than trusting the
// one we asked for.
const actualPort = await new Promise((resolvePort, rejectPort) => {
  let buf = '';
  const timer = setTimeout(
    () => rejectPort(new Error('astro preview printed no address within 20s')),
    20000,
  );
  const scan = chunk => {
    buf += chunk.toString();
    const m = buf.match(/http:\/\/localhost:(\d+)/);
    if (m) {
      clearTimeout(timer);
      resolvePort(Number(m[1]));
    }
  };
  server.stdout.on('data', scan);
  server.stderr.on('data', scan);
  server.on('exit', code => {
    clearTimeout(timer);
    rejectPort(new Error(`astro preview exited early (code ${code})`));
  });
}).catch(err => {
  console.error(`\n✗ ${err.message}\n`);
  server.kill();
  process.exit(1);
});

const URL = `http://localhost:${actualPort}/resume`;

// Always take the server down, including on a thrown error or a Ctrl-C, or the
// port stays claimed and the next run picks a confusing failure.
const stopServer = () => { if (!server.killed) server.kill(); };
process.on('exit', stopServer);
process.on('SIGINT', () => { stopServer(); process.exit(130); });

if (!(await waitForServer(URL))) {
  console.error(`\n✗ Preview server never answered at ${URL}.\n`);
  stopServer();
  process.exit(1);
}
console.log(`  serving ${URL}`);

console.log('▶ Printing /resume to PDF…');
mkdirSync(dirname(OUT), { recursive: true });
run(chrome, [
  '--headless',
  '--disable-gpu',
  // Without this Chrome stamps the page with a URL and a print date, which is
  // exactly the giveaway that a resume came out of a browser.
  '--no-pdf-header-footer',
  `--print-to-pdf=${OUT}`,
  URL,
], 'chrome --print-to-pdf');

stopServer();

// The PDF lives in public/, so dist/ holds the previous one until the site is
// built again. Rebuild here rather than leaving it to the caller: a deploy of a
// stale PDF is the failure this whole script exists to prevent.
console.log('▶ Rebuilding so dist/ carries the new PDF…');
run('npx', ['astro', 'build'], 'astro build');

console.log(`\n✓ Exported ${OUT}\n`);
