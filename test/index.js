var page = new WebPage()
  , url  = encodeURI('file://' + require('fs').absolute('test/index.html'))

page.open(url, function(status) {
  if (status !== "success") {
    console.log("Unable to access network");
    phantom.exit(1);
  } else {
    checkMochaResults(page)
  }
})

var waitUntilTestsAreFinished = function(callback) {
  var prevFinishedCount = 0

  var waitIntervalId = setInterval(function() {
    var currentFinishedCount = page.evaluate(function() {
      return document.getElementsByClassName("test").length
    })

    if(prevFinishedCount == currentFinishedCount) {
      // count has not changed => tests are most likely done
      clearInterval(waitIntervalId)
      callback && callback()
    } else {
      // count has changed => save the current count and wait for next interval
      prevFinishedCount = currentFinishedCount
    }
  }, 500)
}


var checkMochaResults = function(page) {
  waitUntilTestsAreFinished(function() {
    var failCount = page.evaluate(function() {
      return document.getElementsByClassName("test fail").length
    })

    var exitCode = ((failCount == 0) ? 0 : 1)

    console.log('Failed specs: ' + failCount)
    console.log('Exit code: ' + exitCode)

    phantom.exit(exitCode)
  })
}
