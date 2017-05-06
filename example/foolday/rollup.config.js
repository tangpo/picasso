const buble = require('rollup-plugin-buble');
import postcss from 'rollup-plugin-postcss';

import simplevars from 'postcss-simple-vars';
import postCssImport from 'postcss-import';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cssComments from 'postcss-discard-comments';
import css1 from 'rollup-plugin-css-porter';
import css2 from 'rollup-plugin-css-only';
//import extraCss from './plugin/extracss.js';

export default {
  entry: 'index.js',
  format: 'umd',
  dest: './dist/index.js',
  sourceMap: 'inline',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    postcss({
      plugins: [
        simplevars(),
        postCssImport(),
        nested(),
        cssnext({ warnForDuplicates: false, }),
        cssComments(),
        cssnano(),
      ],
      extensions: [ '.css','.less']
    }),
    // css({ dest: './build/css/bundle.css'}),
    // css2({ output: './bundle.css'}),
   // extraCss({output: './build/bundle.css'}),
    buble({
        exclude: 'node_modules/**',
    }),
    replace({
      exclude: 'node_modules/**',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    // eslint({
    //   exclude: [
    //     'src/styles/**','**/node_modules/**'
    //   ]
    // })
  ]
};