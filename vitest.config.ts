import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', 
    globals: true, 
    setupFiles: ['./src/tests/setupTests.ts'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    coverage: {
      provider: 'istanbul', 
      reportsDirectory: './coverage', 
      reporter: ['text', 'lcov'], 
      include: ['src/**/*.{js,ts,jsx,tsx}'], 
      exclude: ['node_modules', 'dist'],
      /*Overall Coverage Summary
      Statements: 10.7% covered
      Branches: 5.47% covered
      Functions: 10.82% covered
      Lines: 10.93% covered*/ 
    },
  },
});
