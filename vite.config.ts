import { defineConfig } from 'vite';

export default defineConfig({
  slidev: {
    serverRef: {
      state: {
        polls: {},
        users: {},
      }
    }
  }
});
