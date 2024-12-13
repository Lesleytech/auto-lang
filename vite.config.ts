import { defineConfig } from 'vite';
import { builtinModules } from 'module';

import packageJson from './package.json' assert { type: 'json' };
import Checker from 'vite-plugin-checker';

const dependencies = Object.keys(packageJson.dependencies);
const devDependencies = Object.keys(packageJson.devDependencies);

export default defineConfig(({ mode }) => {
  const isWatch = mode === 'watch';

  return {
    build: {
      minify: true,
      lib: {
        entry: 'src/index.ts',
        formats: ['es'],
        fileName: () => 'index.js',
      },
      rollupOptions: {
        external: [
          ...builtinModules,
          ...dependencies,
          ...devDependencies,
          /^node:/,
        ],
      },
      target: 'node16',
      outDir: 'dist',
      watch: isWatch
        ? {
            include: ['src/**/*'],
            exclude: ['node_modules', 'dist'],
            clearScreen: true,
          }
        : null,
    },
    plugins: [Checker({ typescript: true })],
  };
});
