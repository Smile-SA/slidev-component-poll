import fs from "fs";
import vue from "rollup-plugin-vue";
import babel from "@rollup/plugin-babel";
import PostCSS from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import ttypescript from "ttypescript";

const name = "Poll";
const lib = "poll";

const external = [
  "vue",
  "@vueuse/motion",
  "@vueuse/core",
  "@slidev/client/state/syncState", 
  "@slidev/client/logic/nav",
  "@slidev/client/constants",
  "/@slidev/configs",
  "uuid",
  "server-reactive:poll"
];
const globals = { vue: "Vue" };

const esbrowserslist = fs
  .readFileSync("./.browserslistrc")
  .toString()
  .split("\n")
  .filter((entry) => entry && entry.substring(0, 2) !== "ie");

const babelPresetEnvConfig = require("./babel.config").presets.filter(
  (entry) => entry[0] === "@babel/preset-env"
)[0][1];

const projectRoot = __dirname;

export default [
  {
    input: "src/index.ts",
    external,
    output: [
      {
        name,
        file: `dist/${lib}.mjs`,
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
      {
        name,
        file: `dist/${lib}.js`,
        format: "cjs",
        exports: "auto",
        sourcemap: true,
        globals,
      },
    ],
    plugins: [
      vue({
        css: true,
        compileTemplate: true,
        defaultLang: { script: "ts" },
      }),
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
      }),
      PostCSS({
        modules: {
          generateScopedName: "[local]___[hash:base64:5]",
        },
        include: /&module=.*\.css$/,
      }),
      PostCSS({ include: /(?<!&module=.*)\.css$/ }),
      commonjs(),
      typescript({ typescript: ttypescript, useTsconfigDeclarationDir: true, check: false }),
      babel({
        exclude: "node_modules/**",
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/preset-env",
            {
              ...babelPresetEnvConfig,
              targets: esbrowserslist,
            },
          ],
        ],
      }),
    ],
  },
];
