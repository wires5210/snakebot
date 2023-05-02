import * as esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: './build/bundle.js',
    platform: 'node',
    format: 'esm',
    sourcemap: 'inline',
    // loader: { '.node': 'copy' },
    external: ['canvas'],
    banner: {
        js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
})
