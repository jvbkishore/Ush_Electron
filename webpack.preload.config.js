const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/main/preload.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'preload.bundle.js',
    },
    target: 'electron-preload',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};