module.exports = function () {
    const postcssFixes = require('postcss-fixes');
    const postcssNext = require('postcss-cssnext');

    const config = [
        postcssFixes(),
        postcssNext({
            browsers: ['last 2 versions'],
            features: {
                customProperties: false,
                rem: false,
            } }),
    ];
    return config;
};
