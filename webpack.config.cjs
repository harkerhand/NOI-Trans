

module.exports = {
  entry: './main.mjs',
  output: {
    filename: 'content_scripts.js',
    path: __dirname + '/NOI-Trans'
  },
  mode: 'development',
  devtool: 'source-map'
};
