import replace from '@rollup/plugin-replace';
import {version} from './package.json';
 
module.exports = {
    input: 'src/index.js',
    output: [
        {
            name: 'vunion',
            file: 'dist/vunion.js',
            format: 'umd',
            exports: 'named'
        },
        {
            name: 'vunion',
            file: 'dist/vunion.esm.js',
            format: 'es',
            exports: 'named'
        },
        {
            name: 'vunion',
            file: 'dist/vunion.common.js',
            format: 'cjs',
            exports: 'named'
        }
    ],
    plugins: [replace({ __VERSION__: version })]
};