import { defineConfig } from 'vite';

export default defineConfig({
  // @ts-expect-error SlidevPluginOptions
  slidev: {
    serverRef: {
      state: {
        poll: {}
      }
    }
  }
});
