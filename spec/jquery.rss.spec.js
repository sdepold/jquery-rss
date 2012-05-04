buster.spec.expose()

describe('jquery.rss', function() {
  before(function() {
    this.element = $('<div>').appendTo($('body'))
    this.timeout = 1000
  })

  it('renders an unordered list by default', function(done) {
    var $container = this.element

    $container.rss('http://feeds.feedburner.com/dawanda', {}, function() {
      var renderedContent = $container.html().replace(/\n/g, '')
      expect(renderedContent).toMatch(/<ul>.*<\/ul>/)
      done()
    })
  })
})
