// iife/cjs usage extends esm default export - so import it all
import plugin, * as namedExports from './entry.esm';

// Attach named exports directly to component. IIFE/CJS will
// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)
Object.entries(namedExports).forEach(([exportName, exported]) => {
  if (exportName !== 'default') plugin[exportName] = exported;
});

export default plugin as typeof plugin & Exclude<typeof namedExports, 'default'>;
