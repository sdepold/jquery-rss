buster.spec.expose()

describe('jquery.rss', function() {
  before(function() {
    var self = this

    this.element = $('<div>').appendTo($('body'))
    this.timeout = 1000
    this.feedUrl = 'http://feeds.feedburner.com/dawanda'
    this.fakeGetJSON = function(content) {
      self.originalGetJSON = $.getJSON

      $.getJSON = function(url, callback) {
        callback({
          responseData: {
            feed: {
              entries: [{
                content: content,
                contentSnippet: content
              }]
            }
          }
        })
      }
    }
  })

  it('renders an unordered list by default', function(done) {
    var $container = this.element

    $container.rss(this.feedUrl, {}, function() {
      var renderedContent = $container.html().replace(/\n/g, '')
      expect(renderedContent).toMatch(/<ul>.*<\/ul>/)
      done()
    })
  })

  it("renders 2 list entries if limit is set to 2", function(done) {
    var $container = this.element

    $container.rss(this.feedUrl, {
      limit: 2
    }, function() {
      expect(jQuery('li', $container).length).toEqual(2)
      done()
    })
  })

  it("renders the defined entry template", function(done) {
    var $container = this.element

    $container.rss(this.feedUrl, {
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

    $container.rss(this.feedUrl, {
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

    $container.rss(this.feedUrl, {
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

  it("removes p-tags but not the content", function(done) {
    var $container = this.element

    this.fakeGetJSON("<p>May the fourth be with you!</p>")

    $container.rss(this.feedUrl, {
      limi: 1,
      entryTemplate: '<li>{bodyPlain}</li>'
    }, function() {
      var renderedContent = $container.html().split('\n').map(function(s){ return s.trim() }).join('').trim()
      expect(renderedContent).toMatch(/<ul><li>May the fourth be with you!<\/li><\/ul>/)
      done()
    })
  })

  describe('tokens', function() {
    describe('> bodyPlain', function() {
      describe('> XSS >', function() {
        after(function(done) {
          var $container = this.element
            , self       = this

          $container.rss(this.feedUrl, {
            limit: 1,
            entryTemplate: '<li>{bodyPlain}</li>'
          }, function() {
            $.getJSON = self.originalGetJSON

            var renderedContent = $container.html().split('\n').map(function(s){ return s.trim() }).join('').trim()
            expect(renderedContent).toMatch(/<ul><li><\/li><\/ul>/)

            done()
          })
        })

        it("removes script tags if they are plain", function() {
          this.fakeGetJSON("<script>alert(1)</script>")
        })

        it("removes script tags with attributes", function() {
          this.fakeGetJSON("<script type=\"text/javascript\">alert(1)</script>")
        })

        it("removes script tags with capital letters", function() {
          this.fakeGetJSON("<SCRIPT SRC=http://ha.ckers.org/xss.js>hallo</SCRIPT>")
        })

        it("strips unsecure image tags with embedded linebreak", function() {
          this.fakeGetJSON("<IMG SRC=\"jav&#x09;ascript:alert('XSS');\">")
        })

        it("strips unsecure image tags with embedded carriage return", function() {
          this.fakeGetJSON("<IMG SRC=\"jav&#x0D;ascript:alert('XSS');\">")
        })

        it("strips unsecure image tags with real carriage return", function() {
          this.fakeGetJSON("<IMG\nSRC\n=\n\"\nj\na\nv\na\ns\nc\nr\ni\np\nt\n:\na\nl\ne\nr\nt\n(\n'\nX\nS\nS\n'\n)\n\"\n>\n")
        })

        it("strips unsecure image tags with \0 in 'javascript'", function() {
          this.fakeGetJSON("<IMG SRC=java\0script:alert(\"XSS\")>")
        })

        it("strips unsecure image tags with meta char before javascript tag", function() {
          this.fakeGetJSON("<IMG SRC=\" &#14;  javascript:alert('XSS');\">")
        })

        it("strips script/xss tags", function() {
          this.fakeGetJSON("<SCRIPT/XSS SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>")
        })

        it("strips script/src tags", function() {
          this.fakeGetJSON("<SCRIPT/SRC=\"http://ha.ckers.org/xss.js\"></SCRIPT>")
        })

        it("strips unsecure body tag", function() {
          this.fakeGetJSON("<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert(\"XSS\")>")
        })
      })

      describe('> XSS 2 >', function() {
        var tests = [{
          name: "strips unsecure image tags with \0 in 'script'",
          test: "<SCR\0IPT>alert(\"XSS\")</SCR\0IPT>",
          result: "alert(\"XSS\")"
        }, {
          name: "strips script tags with extraneous open brackets",
          test: "<<SCRIPT>alert(\"XSS\");//<</SCRIPT>",
          result: "&lt;"
        }]

        tests.forEach(function(test) {
          it(test.name, function(done) {
            var $container = this.element
              , self       = this

            this.fakeGetJSON(test.test)

            $container.rss(this.feedUrl, {
              limit: 1,
              entryTemplate: '<li>{bodyPlain}</li>'
            }, function() {
              $.getJSON = self.originalGetJSON

              var renderedContent = $container.html().split('\n').map(function(s){ return s.trim() }).join('').trim()
              expect(renderedContent).toEqual("<ul><li>" + test.result + "</li><\/ul>")

              done()
            })
          })
        })
      })
    })
  })
})
