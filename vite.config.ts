import { defineConfig } from 'vite';

export default defineConfig({
  slidev: {
    serverRef: {
      state: {
        poll: {}
      }
    }
  }
});
