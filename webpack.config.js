
const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const isProd = process.env.NODE_ENV === 'production';

// 🔁 Shared output paths
const outputPath = path.resolve(__dirname, 'dist');
const manifestPath = path.resolve(outputPath, 'manifest.json');

// Utility functions for naming
function getPackageFolderName(filePath) {
  const parts = filePath.split(path.sep);
  const nodeModulesIndex = parts.indexOf('node_modules');

  if (nodeModulesIndex >= 0) {
    const pkg = parts[nodeModulesIndex + 1];
    if (pkg.startsWith('@')) {
      const scopedPkg = parts[nodeModulesIndex + 2];
      return `${pkg.slice(1)}-${scopedPkg}`;
    }
    return pkg;
  }
  return 'local'; // fallback for files not in node_modules
}

const sanitizePackageName = (resourcePath) => {
  const parts = resourcePath.split(path.sep);
  const index = parts.indexOf('node_modules');

  if (index !== -1) {
    const scope = parts[index + 1];
    const name = parts[index + 2];

    if (scope && scope.startsWith('@')) {
      return `${scope.slice(1)}-${name}`;
    }

    return scope;
  }

  return 'local';
};

// 🔧 MAIN APP CONFIG
const appConfig = {
  name: 'appConfig',
  mode: isProd ? 'production' : 'development',
  entry: {
    main: './src/js/main.js',
    style: './src/scss/style.scss',
  },
  output: {
    filename: isProd ? 'js/[name].[contenthash].js' : 'js/[name].js',
    path: outputPath,
    publicPath: '/', // necessary for dynamic loading
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {
              targets: 'defaults'
            }]]
          }
        }
      },
      // SCSS/CSS loader
      {
        test: /\.(scss|css)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../', // optional
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      // Images
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: (pathData) => {
            const pkg = getPackageFolderName(pathData.filename);
            const fileName = path.basename(pathData.filename);
            return `img/${pkg}/${fileName}`;
          }
        }
      },
      // Fonts
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: (pathData) => {
            const pkg = getPackageFolderName(pathData.filename);
            const fileName = path.basename(pathData.filename);
            return `fonts/${pkg}/${fileName}`;
          }
        }
      }
    ]
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        jqueryUi: {
          test: /[\\/]node_modules[\\/]jquery-ui[\\/]/,
          name: 'vendor/jquery-ui',
          chunks: 'all',
          enforce: true,
        },
        bootstrap: {
          test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
          name: 'vendor/bootstrap',
          chunks: 'all',
          enforce: true,
        },
        // Add more vendors as needed
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const pkg = sanitizePackageName(module.identifier());
            return `vendor/${pkg}`;
          },
          chunks: 'all',
          enforce: true,
          priority: -10
        },
        default: false
      },
    }
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: false,
      cleanOnceBeforeBuildPatterns: ['**/*', '!loader.js', '!loader.*.js'],
      cleanAfterEveryBuildPatterns: [],
    }),
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: (pathData) => {
        let name = pathData.chunk.name || 'main';

        // Strip "vendor-" prefix
        name = name.replace(/^vendor/, '');

        // Flatten scoped packages like @popperjs/core → popperjs-core
        name = name.replace(/^@/, '').replace(/\//g, '-');

        // If the name starts with a dash, remove it
        name = name.replace(/^[-]/, '');

        return isProd ? `css/${name}.[contenthash]` : `css/${name}.css`;
      },
      chunkFilename: isProd ? 'css/[name].[contenthash]' : 'css/[name].css',
    }),
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
      publicPath: '/',
      generate: (seed, files) => {
        const manifest = {};
        files.forEach(file => {
          manifest[file.name] = file.path;
        });
        return manifest;
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        // {
        //   from: path.resolve(__dirname, 'src/loader.js'),
        //   to: path.resolve(__dirname, 'dist/loader.js'), // or wherever your output path is
        //   noErrorOnMissing: true,
        // },
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist/assets'), // or wherever your output path is
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'src/assets/img'),
          to: path.resolve(__dirname, 'dist/img'), // or wherever your output path is
          noErrorOnMissing: true,
        },
      ],
    }),
  ],

  devtool: isProd ? false : 'source-map',

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true
  },

  resolve: {
    alias: {
      '@js': path.resolve(__dirname, 'src/js'),
      '@scss': path.resolve(__dirname, 'src/scss')
    },
    extensions: ['.js', '.scss'],
  },
  watch: true, // 🔁 Enable watching
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 500, // or set to `false` to use native file system events
  },
};

// 🔧 LOADER CONFIG
const loaderConfig = {
  name: 'loader',
  mode: isProd ? 'production' : 'development',
  entry: {
    loader: './src/loader.js'
  },
  output: {
    filename: '[name].js',
    path: outputPath,
    publicPath: '/',
    clean: false
  },
  plugins: [
    new webpack.DefinePlugin({
      __ASSET_MANIFEST__: JSON.stringify(
        fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) : {}
      ),
      'process.env.DEBUG': JSON.stringify(true),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    esmodules: true, // assumes modern browsers
                  },
                  bugfixes: true,
                  useBuiltIns: false,
                  modules: false
                }
              ]
            ],
            plugins: [],
          },
        }
      },
    ],
  },
  devtool: isProd ? false : 'source-map'
};

//module.exports = [ appConfig, loaderConfig ];

module.exports = (env = {}) => {
  const targets = {
    loader: loaderConfig,
    app: appConfig,
  };

  if (env.target && targets[env.target]) {
    return targets[env.target];
  }

  return [appConfig, loaderConfig]; // fallback
};
