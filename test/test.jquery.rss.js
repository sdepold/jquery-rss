describe('jquery.rss', function() {
  var $container

  beforeEach(function() {
    $container = $('#jquery-rss')
    $container.html('')
  })

  it('renders an unordered list by default', function(done) {
    $container.rss('http://feeds.feedburner.com/dawanda', {}, function() {
      var renderedContent = $container.html().replace(/\n/g, '')
      expect(renderedContent).to.match(/<ul>.*<\/ul>/)
      done()
    })
  })
})
