# Modern-Webpack-Boilerplate-with-Essential-Features

This Webpack boilerplate provides a solid foundation for modern web development projects, integrating popular features and optimizations out-of-the-box. The boilerplate includes support for JavaScript (ES6+), CSS, and HTML files, as well as popular libraries and tools such as Babel, AOS, and Typed.js.

### Create folder hierarchy and asset organization:

```sh
mkdir -p my-project/{src/{app/auth,assets/{fonts,images,videos},pages/{about,contact,forgot,forgot_confirm,home,login,privacy,secret,signup,signup_confirm,tos},shared/{css,html}},}
```
```sh
touch my-project/{LICENSE,package.json,package-lock.json,README.MD,webpack.config.js,src/{app/auth/{auth_content.js,auth_forgot_password.js,auth_login.js,auth_logout.js,auth_signup.js,auth_user.js},pages/{about/{index.html,index.js,style.css},contact/{index.html,index.js,style.css},forgot/{index.html,index.js,style.css},forgot_confirm/{index.html,index.js,style.css},home/{index.html,index.js,style.css},login/{index.html,index.js,style.css},privacy/{index.html,index.js,style.css},secret/{index.html,index.js,style.css},signup/{index.html,index.js,style.css},signup_confirm/{index.html,index.js,style.css},tos/{index.html,index.js,style.css}},pages.js,shared/{css/font.css,html/{footer.html,topnav.html}}}}
```
```sh
cd my-project
```
### Initialize NPM and install the required packages

```sh
npm init -y
```
```sh
npm install webpack webpack-dev-server webpack-cli copy-webpack-plugin html-webpack-plugin mini-css-extract-plugin css-loader sass-loader sass file-loader url-loader image-minimizer-webpack-plugin imagemin imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo terser-webpack-plugin bootstrap bootstrap-icons aos typed.js @babel/core @babel/preset-env babel-loader html-loader --save-dev
```
## Tree visualization:

```css
my-project
├── LICENSE
├── package.json
├── package-lock.json
├── README.MD
├── src
│   ├── app
│   │   └── auth
│   ├── assets
│   │   ├── fonts
│   │   ├── images
│   │   └── videos
│   ├── pages
│   │   ├── about
│   │   ├── contact
│   │   ├── forgot
│   │   ├── forgot_confirm
│   │   ├── home
│   │   ├── login
│   │   ├── privacy
│   │   ├── secret
│   │   ├── signup
│   │   ├── signup_confirm
│   │   └── tos
│   └── shared
│       ├── css
│       └── html
└── webpack.config.js

```

### Add your content

## Add your webpack config file.

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const pages = require('./src/pages.js');

function generateEntryPoints() {
  const entries = {};
  for (const page of pages) {
    entries[page.name] = `${page.path}/index.js`;
  }
  console.log("Generated entry points:", entries);
  return entries;
}

function generateHtmlPlugins() {
  const plugins = pages.map(
    (page) =>
    new HtmlWebpackPlugin({
      template: `${page.path}/index.html`,
      filename: `${page.name}.html`,
      chunks: [page.name],
      minify: true,
    })
  );
  console.log("Generated HTML plugins:", plugins);
  return plugins;
}
module.exports = {
  mode: 'development',
  entry: {
    ...generateEntryPoints(),
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8090,
    open: true,
    hot: true,
    historyApiFallback: true,
  },

  module: {
    rules: [{
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext][query]'
        }
      },
      {
        test: /\.(ogg|ogv|ogx|webm|mp4)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'videos/[name][ext][query]'
        }
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['gifsicle', {
                interlaced: true
              }],
              ['jpegtran', {
                progressive: true
              }],
              ['optipng', {
                optimizationLevel: 5
              }],
              [
                'svgo',
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      convertShapeToPath: {
                        convertArcs: true,
                      },
                      convertPathData: false,
                    },
                  },
                },
              ],
            ],
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8090,
    open: true,
    hot: true,
    historyApiFallback: {
      rewrites: [{
          from: /^\/$/,
          to: '/home.html'
        },
        {
          from: /^\/about/,
          to: '/about.html'
        },
        {
          from: /^\/signup/,
          to: '/signup.html'
        },
        {
          from: /^\/signup_confirm/,
          to: '/signup_confirm.html'
        },
        {
          from: /^\/login/,
          to: '/login.html'
        },
        {
          from: /^\/forgot/,
          to: '/forgot.html'
        },
        {
          from: /^\/forgot_confirm/,
          to: '/forgot_confirm.html'
        },
        {
          from: /^\/secret/,
          to: '/secret.html'
        },
        {
          from: /^\/tos/,
          to: '/tos.html'
        },
        {
          from: /^\/contact/,
          to: '/contact.html'
        },
        {
          from: /^\/privacy/,
          to: '/privacy.html'
        },
        // Add more rewrites as needed
      ],
    },
  },

  plugins: [
    ...generateHtmlPlugins(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'src/assets/images/favicon.ico',
        to: 'favicon.ico',
      }, ],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

```

### Add your .babelrc file.

```js
{
  "presets": ["@babel/preset-env"]
}

```
### Add your HTML content.

```HTML

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>YOUR_TITLE_HERE</title>
  <meta name="description" content="YOUR_DESCRIPTION_HERE">
  <meta name="keywords" content="YOUR_KEYWORDS_HERE">
  <meta property="og:title" content="YOUR_OG_TITLE_HERE">
  <meta property="og:description" content="YOUR_OG_DESCRIPTION_HERE">
  <!--
  <meta property="og:image" content="YOUR_OG_IMAGE_URL_HERE">
  <meta property="og:url" content="YOUR_OG_URL_HERE">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="YOUR_TWITTER_TITLE_HERE">
  <meta name="twitter:description" content="YOUR_TWITTER_DESCRIPTION_HERE">
  <meta name="twitter:image" content="YOUR_TWITTER_IMAGE_URL_HERE">
  <link rel="canonical" href="YOUR_CANONICAL_URL" />
  -->
  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "REPLACE_WITH_YOUR_WEBPAGE_TITLE",
      "description": "REPLACE_WITH_YOUR_WEBPAGE_DESCRIPTION",
      "url": "REPLACE_WITH_YOUR_WEBPAGE_URL"
    }
  </script>
  <meta name="robots" content="index, follow" />
</head>
<body>
    <!-- Main Content -->
    <section id="landing-page">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <!-- With this -->
            <h1 class="display-1 fw-bolder p-5" data-aos="fade-up"><span id="typed-text"></span></h1>
          </div>
        </div>
      </div>
    </section>
</body>
</html>

```

### Add your page index.js content.

```js
// Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
// AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
// Types
import Typed from 'typed.js';
// Shared
import '../../shared/css/font.css';
import topnav from "../../shared/html/topnav.html";
import footer from "../../shared/html/footer.html";

document.addEventListener('DOMContentLoaded', () => {
  // Insert topnav HTML as the first child of the body
  const topnavElement = document.createElement('div');
  topnavElement.innerHTML = topnav;
  document.body.insertBefore(topnavElement, document.body.firstChild);

  // Initialize AOS
  AOS.init();

  // Initialize Typed.js
  const typedElement = document.querySelector('#typed-text');
  if (typedElement) {
    const typed = new Typed('#typed-text', {
      strings: ['This is the home page.', 'It is great for content about your and/or your organization.'],
      typeSpeed: 100,
      loop: true,
      loopCount: Infinity,
    });
  }
  // Copyright
  const setCopyrightYear = () => {
    const currentYear = new Date().getFullYear();
    document.querySelector('#copyright-year').textContent = currentYear;
  };

  // Insert footer HTML as the last child of the body
  const footerElement = document.createElement('div');
  footerElement.innerHTML = footer;
  document.body.appendChild(footerElement);

  // Set copyright year
  setCopyrightYear();
});

```


## Webpack Build Commands:

### Production:

```sh

npx webpack --mode production

npx webpack serve --mode production

```

### Development:

```sh

npx webpack --mode development

npx webpack serve --mode development

```
