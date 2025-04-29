import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  slidev: {
    serverRef: {
      state: {
        poll: {},
        pollUsers: {},
      }
    }
  }
});
