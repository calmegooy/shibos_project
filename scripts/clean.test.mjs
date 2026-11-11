import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

test('clean removes generated output and preserves server.js', async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), 'shiboss-clean-'));
  const cleanScript = fileURLToPath(new URL('./clean.mjs', import.meta.url));

  try {
    await mkdir(path.join(project, 'dist'));
    await mkdir(path.join(project, '.astro'));
    await writeFile(path.join(project, 'server.js'), 'production server');

    execFileSync(process.execPath, [cleanScript], { cwd: project });

    await assert.rejects(readFile(path.join(project, 'dist')));
    await assert.rejects(readFile(path.join(project, '.astro')));
    assert.equal(await readFile(path.join(project, 'server.js'), 'utf8'), 'production server');
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});
