module.exports = {
  plugins: [
    require('autoprefixer')({}),
    require('mqpacker')({
      sort: true,
    }),
    // require('cssnano')({
    //   preset: 'default',
    // }),
  ],
};
