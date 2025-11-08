import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildConfig = {
  entryPoints: [join(__dirname, 'src', 'server.js')],
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'esm',
  outfile: join(__dirname, 'dist', 'bundle.js'),
  minify: true,
  sourcemap: false,
  treeShaking: true,
  external: [],
  banner: {
    js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);`
  }
};

/**
 * Виконує build процес
 */
async function build() {
  try {
    console.log('🚀 Starting production build...');
    
    const startTime = Date.now();
    
    await esbuild.build(buildConfig);
    
    const endTime = Date.now();
    const buildTime = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`Build completed successfully in ${buildTime}s`);
    console.log(`Output: dist/bundle.js`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();