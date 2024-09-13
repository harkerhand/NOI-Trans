

module.exports = {
  entry: './main.mjs',
  output: {
    filename: 'background.js',
    path: __dirname + '/NOI-Trans'
  },
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.mjs'],
  }
};
