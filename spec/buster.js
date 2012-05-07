module.exports = {
  'node': {
    rootPath: "../",
    environment: 'browser',
    libs: [
      "lib/*.js"
    ],
    tests: [
      'spec/*.spec.js'
    ],
    sources: [
      "dist/jquery.rss.min.js"
    ]
  }
}
