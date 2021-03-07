const CompressionPlugin = require("compression-webpack-plugin");
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = env => {
    const mode = env && ['production', 'development'].includes(env.MODE) ? env.MODE : 'development';
    const bundleCss = env && env.CSS;   
    const dev = mode === 'development';
    return {
        name: 'tryal-ui',
        mode,
        target: 'web',
        entry: path.resolve(__dirname, './src/index.js'),
        output: {
            path: path.resolve(__dirname, './build'),
            filename: '[name].js'
        },
        resolve: {
            alias: {
                //Svelte
                svelte: path.resolve('node_modules', 'svelte'),
                //Src links
                components: path.resolve('src', 'components'),
                styles: path.resolve('src', 'styles'),
                lib: path.resolve('src', 'lib'),
                assets: path.resolve('src', 'assets'),
                trygraph: path.resolve('trygraph'),
                trygrammar: path.resolve('trygrammar')
            },
            extensions: ['.mjs', '.js', '.svelte'],
            mainFields: ['svelte', 'browser', 'module', 'main']
        },
        module: {
            rules: [
                {
                    test: /\.pegjs$/,
                    loader: 'pegjs-loader'
                },
                {
                    test: /\.(html|svelte)$/,
                    //exclude: /node_modules/,
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            emitCss: true,
                            css: true,
                            hotReload: dev
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        dev || bundleCss ? 'style-loader' : ExtractCssChunks.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            }
                        }
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        dev || bundleCss ? 'style-loader' : ExtractCssChunks.loader,
                        // Translates CSS into CommonJS
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            }
                        },
                        // Compiles Sass to CSS
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(png|jp(e*)g|svg)$/i,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 100000,
                            name: 'assets/[hash]-[name].[ext]'
                        }
                    }
                    ],
                },
            ]
        },
        plugins: [
            new ExtractCssChunks({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].css',
            }),
            new CompressionPlugin({
                test: /\.(css|js)$/
            }),
            new CopyPlugin([
                { from: './example/local/index.html', to: 'index.html' }
            ])
        ],
    };
}