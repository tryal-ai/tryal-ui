const path = require('path');

module.exports = env => {
    const mode = env && ['production', 'development'].includes(env.MODE) ? env.MODE : 'development';
    const dev = mode === 'development';
    return {
        name: 'tryal-ui',
        mode,
        target: 'web',
        entry: path.resolve(__dirname, './src/index.js'),
        output: {
            path: path.resolve(__dirname),
            filename: 'index.js'
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
                trygraph: path.resolve('trygraph')
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
                        'style-loader',
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
                        'style-loader',
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
    };
}