
// postcss.config.js - CORRECT WAY
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- Use the new package
    autoprefixer: {}, // Keep autoprefixer
  },
};