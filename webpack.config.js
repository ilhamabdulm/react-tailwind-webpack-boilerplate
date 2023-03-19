const { HotModuleReplacementPlugin } = require('webpack');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const history = require('connect-history-api-fallback');

const glob = require('glob');
const path = require('path');

const PATHS = {
  src: path.join(__dirname, 'src'),
};

const commonConfig = {
  entry: './src/index.jsx',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['react-hot-loader/babel'],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('node-sass'),
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html', // point to the correct location of index.html
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

const developmentConfig = {
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true, // Add this line
    onBeforeSetupMiddleware(server) {
      const app = server.app;
      app.use(history());
    },
  },
};

const productionConfig = {
  mode: 'production',
  output: {
    filename: 'bundle.[contenthash].js',
    path: __dirname + '/dist',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: { drop_console: true },
        },
      }),
    ],
  },
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html', // point to the correct location of index.html
      filename: './index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
};

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  if (isDevelopment) {
    return {
      ...commonConfig,
      ...developmentConfig,
    };
  } else {
    return {
      ...commonConfig,
      ...productionConfig,
    };
  }
};
