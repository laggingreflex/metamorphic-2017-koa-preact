import Path from 'path';
import webpack from 'webpack';
import extractText from 'extract-text-webpack-plugin';
import html from 'html-webpack-plugin';
import scripts from 'script-ext-html-webpack-plugin';
import offline from 'offline-plugin';
import stylus from 'stylus-loader';
import purifyCSS from 'purifycss-webpack';
import babel from 'babel-webpack-plugin';
import koutoSwiss from 'kouto-swiss';
import compression from 'compression-webpack-plugin';
import manifest from 'chunk-manifest-webpack-plugin';
import { BundleAnalyzerPlugin as analyze } from 'webpack-bundle-analyzer';
import babili from 'babili-webpack-plugin';
// import IsomorphicLoaderPlugin from 'isomorphic-loader/lib/webpack-plugin';
import _ from 'lodash';
import commonConfig from './config';
import pkgJson from './package.json';

const isProd = process.env.NODE_ENV === 'production';

const sourceDir = Path.join(__dirname, 'src/client');
const outputDir = Path.join(__dirname, 'dist/client');

const config = {};
const module = config.module = {};
const loaders = module.loaders = [];
const plugins = config.plugins = [];
const devServer = config.devServer = {};

// config.target = 'node';

config.resolve = { modules: [sourceDir, 'node_modules'] };

config.context = sourceDir;

config.entry = {
  app: [
    'babel-polyfill',
    Path.join(sourceDir, 'index.js')
  ]
};
config.output = {
  path: outputDir,
  filename: isProd ? '[name].[chunkhash].js' : '[name].js',
  sourceMapFilename: '[file].map',
  publicPath: '/',
  hashDigestLength: 5,
};
config.devtool = isProd ? 'source-map'
  : 'cheap-module-source-map';
// 'eval';
// 'cheap-module-eval-source-map';

loaders.push({
  test: /\.js$/,
  include: sourceDir,
  loader: [
    // 'babel-loader',
    isProd ? false : 'webpack-module-hot-accept',
  ].filter(Boolean),
});

const postCssLoaders = [
  // deadCss.extract(),
  // 'style-loader',
  {
    loader: 'css-loader',
    query: {
      importLoaders: 3,
      modules: true,
      // localIdentName: '[local]__[path][name]_[hash:base64:5]',
      localIdentName: '[hash:base64:5]',
      sourceMap: true,
    },
  },
  // 'isomorphic',
  // ,{
  //   loader: 'dead-css-loader',
  //   query: {
  //     // spinalCase: false,
  //     // recursion: 1,
  //     // plugins: false,
  //     // ignore: ['ignoredClass'],
  //     // allowIds: false,
  //     // allowNonClassCombinators: false,
  //     // allowNonClassSelectors: false,
  // }, {
  //   // causes errors, and too slow
  //   loader: 'postcss-loader',
  // }, {
  //   loader: 'namespace-css-module-loader',
  //   query: {
  //     combine: true,
  //     descendant: true,
  //  },
];

loaders.push({
  test: /\.css$/,
  include: sourceDir,
  loader: extractText.extract({
    loader: postCssLoaders,
    fallbackLoader: 'style-loader',
  }),
});
loaders.push({
  test: /\.css$/,
  exclude: sourceDir,
  loader: extractText.extract({
    loader: 'css-loader',
    fallbackLoader: 'style-loader',
  }),
});

loaders.push({
  test: /\.s(a|c)ss$/,
  include: sourceDir,
  loader: extractText.extract({
    loader: [...postCssLoaders, 'sass-loader'],
    fallbackLoader: 'style-loader',
  }),
});
loaders.push({
  test: /\.s(a|c)ss$/,
  exclude: sourceDir,
  loader: extractText.extract({
    loader: 'sass-loader',
    fallbackLoader: 'style-loader',
  }),
});

loaders.push({
  test: /\.less$/,
  include: sourceDir,
  loader: extractText.extract({
    loader: [...postCssLoaders, 'less-loader'],
    fallbackLoader: 'style-loader',
  }),
});
loaders.push({
  test: /\.less$/,
  exclude: sourceDir,
  loader: extractText.extract({
    loader: 'less-loader',
    fallbackLoader: 'style-loader',
  }),
});

loaders.push({
  test: /\.styl$/,
  include: sourceDir,
  loader: extractText.extract({
    loader: [...postCssLoaders, {
      loader: 'stylus-loader',
      options: {
        paths: [sourceDir],
        import: ['theme'],
      },
    }],
    fallbackLoader: 'style-loader',
  }),
});
loaders.push({
  test: /\.styl$/,
  exclude: sourceDir,
  loader: extractText.extract({
    loader: 'stylus-loader',
    fallbackLoader: 'style-loader',
  }),
});

plugins.push(new stylus.OptionsPlugin({
  default: {
    // preferPathResolver: 'webpack',
    use: [
      koutoSwiss(),
    ],
    import: [
      '~kouto-swiss/index.styl',
    ]
  }
}));

loaders.push({
  test: /\.js$/,
  include: sourceDir,
  loader: [
    'babel-loader',
    // 'hyperscript-css-modules-injector',
    isProd ? false : 'webpack-module-hot-accept',
  ].filter(Boolean),
});

loaders.push({
  test: /\.md$/,
  include: sourceDir,
  loader: [
    'raw-loader',
    // 'html-loader',
    // 'markdown-loader',
  ],
});

loaders.push({
  test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  loader: 'url-loader',
  query: {
    limit: 1000,
    name: isProd ? 'assets/[name].[hash:5].[ext]' : 'assets/[name].[ext]',
  },
});

// plugins.push(new babel({
//   test: /\.js$/,
//   presets: ['es2015', 'stage-0'],
//   plugins: [
//     // 'istanbul',
//     'transform-decorators-legacy',
//   ],
//   sourceMaps: true,
//   compact: false,
// }));

// plugins.push(new IsomorphicLoaderPlugin());

plugins.push(new extractText({
  filename: isProd ? '[name].[chunkhash].css' : '[name].css',
  disable: !isProd,
  allChunks: true,
}));

plugins.push(new webpack.NamedModulesPlugin());

if (isProd) {
  // // too slow... doesn't work with CSS modules
  // plugins.push(new purifyCSS({
  //   styleExtensions: ['.css', '.styl'],
  //   // extensions: ['.html', '.jsx'],
  //   // paths: (Path.join(__dirname, 'app/*.html')),
  //   paths: require('glob').sync(Path.join(sourceDir, '**')),
  //   // paths: require('glo').sync(Path.join(__dirname, 'app/*.html')),
  //   // paths: (Path.join(__dirname, 'app/*.html')),
  //   // paths: [Path.join(sourceDir, '/index.html')],
  //   // basePath: sourceDir,
  //   // paths: ['*.html'],
  //   // resolveExtensions: ['.html'],
  //   purifyOptions: {
  //     minify: true,
  //     rejected: true,
  //     info: true,
  //   },
  //   verbose: true,
  // }));
}

// plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'webpack' }));
/* Separate out the node_modules ... */
plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'node_modules',
  minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
}));

// /* ... and the webpack manifest so that its hash doesn't change */
plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'webpack' }));
// plugins.push(new manifest({ filename: 'webpack.json' }));

if (isProd) {
  // // causing weird bug, slowdown
  // plugins.push(new webpack.LoaderOptionsPlugin({
  //   // minimize: true,
  //   // debug: true,
  // }));

  // plugins.push(new webpack.optimize.UglifyJsPlugin({
  //   // mangle: { except: ['$super', '$', 'exports', 'require'] },
  //   mangle: false,
  //   comments: false,
  // }));

  plugins.push(new babili({
    mangle: {
      keepFnName: true,
    },
    // evaluate: false,
    // deadcode: false,
    // infinity: false,
    // mangle: false,
    // numericLiterals: false,
    // replace: false,
    // simplify: false,
    // mergeVars: false,
    // booleans: false,
    // regexpConstructors: false,
    // removeConsole: false,
    // removeDebugger: false,
    // removeUndefined: false,
    // undefinedToVoid: false,
  }, {}));

  plugins.push(new compression({
    asset: '[path].gz[query]',
    // algorithm: "gzip",
    // test: /\.js$|\.html$|\.css$/,
    // threshold: 10240,
    // minRatio: 0.8,
  }));
}

plugins.push(new webpack.ProvidePlugin({
  // $: 'jquery',
  // jQuery: 'jquery',
  // 'window.jQuery': 'jquery',
  // 'window.Tether': 'tether',
}));

// plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV', 'IP', 'PORT', 'API_HOST']));
plugins.push(new webpack.DefinePlugin({
  'process.env': [
    'NODE_ENV', 'IP', 'PORT', 'API_HOST'
  ].reduce((o, k) => ({ ...o, [_.snakeCase(k).toUpperCase()]: JSON.stringify(commonConfig.get(_.camelCase(k))) }), {})
}));

plugins.push(new html({
  template: 'index.html',
  inject: false,
  title: _.startCase(pkgJson.name),
  config: commonConfig.get(),
}));
plugins.push(new scripts({
  // sync: 'app',
  defaultAttribute: 'defer',
}));

plugins.push(new analyze({
  analyzerMode: 'static',
  openAnalyzer: false,
  generateStatsFile: true,
}));

if (isProd) {
  plugins.push(new offline({}));
}

config.stats = 'minimal';
devServer.stats = config.stats;

devServer.host = commonConfig.clientHost;
devServer.port = commonConfig.clientPort;

export default config;
