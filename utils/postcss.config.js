module.exports = function() { 
const postcssFixes = require('postcss-fixes');
const postcssNext = require('postcss-cssnext');

  const config = [
  postcssFixes(),
  postcssNext({
    features: {customProperties: false}})];
    return config;

};
