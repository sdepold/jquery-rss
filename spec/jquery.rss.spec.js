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

  it("renders 2 list entries if limit is set to 2", function(done) {
    var $container = this.element

    $container.rss('http://feeds.feedburner.com/dawanda', {
      limit: 2
    }, function() {
      expect(jQuery('li', $container).length).toEqual(2)
      done()
    })
  })

  it("renders the defined entry template", function(done) {
    var $container = this.element

    $container.rss('http://feeds.feedburner.com/dawanda', {
      limit: 1,
      entryTemplate: '<li>foo</li>'
    }, function() {
      var renderedContent = $container.html().split('\n').map(function(s){ return s.trim() }).join('').trim()
      expect(renderedContent).toMatch(/<ul><li>foo<\/li><\/ul>/)
      done()
    })
  })

  it("renders the defined layout template", function(done) {
    var $container = this.element

    $container.rss('http://feeds.feedburner.com/dawanda', {
      limit: 1,
      layoutTemplate: 'foo<ul>{entries}</ul>bar'
    }, function() {
      var renderedContent = $container.html().replace(/\n/g, '')
      expect(renderedContent).toMatch(/foo<ul>.*<\/ul>/)
      done()
    })
  })

  it("supports custom tokens", function(done) {
    var $container = this.element

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
      expect(renderedContent).toMatch(new RegExp("<ul><li>static dynamic</li></ul>"))
      done()
    })
  })
})
