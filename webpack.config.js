const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");




module.exports = (env) => {

  // Display compilation mode
  console.log('mode = ', env.mode);


  // Prepare the config variable
  config = {

    // Set compilation mode
    mode: env.mode ?? 'production',


    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    devtool: (env.mode == 'production') ? false : "eval-source-map",


    // Watch in development mode only
    watch: (env.mode == 'production') ? false : true,


    // Default entry point is main
    entry: {
      main: ['./src/js/main.js'],
    },


    // The location of the build folder
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: '/',
      clean: true,
    },


    // Aliasses
    resolve: {
      alias: {
        Static: path.resolve(__dirname, "src/static/"),
        Js: path.resolve(__dirname, "src/js/"),
      }
    },


    // CSS, images and HTML loaders
    module: {
      rules: [

        // CSS loader
        {
          test: /\.css$/i,
          exclude: /\.lazy\.css$/i,
          use: ["style-loader", "css-loader"],
        },

        // CSS lazy loader
        {
          test: /\.lazy\.css$/i,
          use: [
            { loader: "style-loader", options: { injectType: 'lazyStyleTag' } },
            { loader: "css-loader", options: { url: false } }
          ],
        },

        // Images loader
        {
          test: /\.(png|svg|jpe?g|gif)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8000, // Convert images < 8kb to base64 strings
                name: 'images/[hash]-[name].[ext]'
              }
            },
          ],
        },

        // HTML loader
        {
          test: /src(\/|\\)js(\/|\\).+(\/|\\)[A-Za-z]+\.html$/i,
          loader: "html-loader",
          options: { sources: false },
        },

      ],
    },

    // Plugins (copy, html css minifiers)
    plugins: [

      // Copy static files: images, favicons, css ...
      new CopyPlugin({
        patterns: [
          {
            from: 'src/static/',
            to: 'static',
          },
          {
            from: 'src/static/favicon/favicon.ico',
            to: 'favicon.ico',
          },
          {
            from: 'src/static/favicon/apple-touch-icon.png',
            to: 'apple-touch-icon.png',
          },
          {
            from: 'src/static/favicon/apple-touch-icon.png',
            to: 'apple-touch-icon-precomposed.png',
          },

        ],
        options: { concurrency: 100, },
      }),



      // index.html

      new HtmlWebpackPlugin({
        title: 'Beautiful Css',
        chunks: ['main'],
        filename: 'index.html',
        minify: { collapseWhitespace: true },
        template: './src/templates/index.ejs',
        templateParameters: {
          title: 'Beautiful CSS',
          description: 'Beautiful CSS & Web Components',
          baseUrl: 'https://beautiful-css.com',
          canonical: '/',


        }
      }),


      // Minify CSS
      new MiniCssExtractPlugin(),
    ]
  }

  //console.log(config.entry);
  return config;
};