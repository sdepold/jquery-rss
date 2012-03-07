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

  it("renders 2 list entries if limit is set to 2", function(done) {
    $container.rss('http://feeds.feedburner.com/dawanda', {
      limit: 2
    }, function() {
      expect(jQuery('li', $container)).to.have.length(2)
      done()
    })
  })

  it("renders the defined entry template", function(done) {
    $container.rss('http://feeds.feedburner.com/dawanda', {
      limit: 1,
      entryTemplate: '<li>foo</li>'
    }, function() {
      var renderedContent = $container.html().split('\n').map(function(s){ return s.trim() }).join('').trim()
      expect(renderedContent).to.match(/<ul><li>foo<\/li><\/ul>/)
      done()
    })
  }),

  it("renders the defined layout template", function(done) {
    $container.rss('http://feeds.feedburner.com/dawanda', {
      limit: 1,
      layoutTemplate: 'foo<ul>{entries}</ul>bar'
    }, function() {
      var renderedContent = $container.html().replace(/\n/g, '')
      expect(renderedContent).to.match(/foo<ul>.*<\/ul>/)
      done()
    })
  })

  it("supports custom tokens", function(done) {
    $container.rss('http://feeds.feedburner.com/dawanda', {
      limit: 1,
      entryTemplate: '<li>{myCustomStaticToken} {myCustomDynamicToken}</li>',
      tokens: {
        myCustomStaticToken: 'static',
        myCustomDynamicToken: function() {
          return 'dynamic'
        }
      }
    }, function() {
      var renderedContent = $container.html().split('\n').map(function(s){ return s.trim() }).join('').trim()
      expect(renderedContent).to.match(new RegExp("<ul><li>static dynamic</li></ul>"))
      done()
    })
  })
})
