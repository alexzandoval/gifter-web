const path = require(`path`)

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@Assets': path.resolve(__dirname, 'src/assets'),
      '@Components': path.resolve(__dirname, 'src/components'),
      '@Constants': path.resolve(__dirname, 'src/constants'),
      '@Context': path.resolve(__dirname, 'src/context'),
      '@Enums': path.resolve(__dirname, 'src/ts/enums'),
      '@Firebase': path.resolve(__dirname, 'src/firebase'),
      '@Hooks': path.resolve(__dirname, 'src/hooks'),
      '@Icons': path.resolve(__dirname, 'src/icons'),
      '@Services': path.resolve(__dirname, 'src/services'),
      '@Styles': path.resolve(__dirname, 'src/styles'),
      '@Types': path.resolve(__dirname, 'src/ts/types'),
      '@Utility': path.resolve(__dirname, 'src/utility'),
    },
  },
}
