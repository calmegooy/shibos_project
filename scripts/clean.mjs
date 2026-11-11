import { rm } from 'node:fs/promises';

await Promise.all(
  ['dist', '.astro'].map((directory) =>
    rm(directory, { recursive: true, force: true })
  )
);
