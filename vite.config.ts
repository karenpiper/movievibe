import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

// Strip version suffixes like "package@1.2.3" in import specifiers
function stripVersionedImports(): Plugin {
  return {
    name: 'strip-versioned-imports',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.(t|j)sx?$/.test(id)) return;
      const next = code.replace(/from\s+(["'])((?:[^"'@]|@(?=.*\/))+)@\d+\.\d+\.\d+\1/g, 'from $1$2$1');
      if (next !== code) return { code: next, map: null };
    },
  };
}

export default defineConfig({
  plugins: [stripVersionedImports(), react(), tailwind()],
});

