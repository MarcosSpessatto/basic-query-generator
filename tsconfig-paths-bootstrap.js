const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const paths = tsConfig.compilerOptions.paths;

tsConfigPaths.register({
  paths,
  baseUrl: tsConfig.compilerOptions.outDir
});
