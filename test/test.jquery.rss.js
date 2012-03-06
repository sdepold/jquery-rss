describe('jquery.rss', function() {
  it('does things', function(done) {
    $('jquery-rss').rss('http://feeds.feedburner.com/dawanda', {}, function() {
      expect(1).to.equal(1)
      done()
    })
  })
})
