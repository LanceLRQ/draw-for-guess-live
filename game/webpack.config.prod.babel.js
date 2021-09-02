import {deleteFolderTree} from './public/webpack/utils';

require('@babel/register');

import optimist from 'optimist';
import { ROOT } from './public/paths';

const { argv } = optimist;
if (argv.clean) {
  console.log(`Remove folder: ${ROOT.DIST.BUILD}`);
  deleteFolderTree(ROOT.DIST.BUILD);
}

module.exports = require('./public/webpack/production.js').buildProductionWebpackConfiguration([], argv.compress);
