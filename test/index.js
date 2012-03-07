var testFile = encodeURI('file://' + __dirname + '/index.html')

require("phantom").create(function(phantom) {
  phantom.createPage(function(page) {
    page.open(testFile, function(status) {
      if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit();
      } else {
        checkMochaResults(phantom, page)
      }
    })
  })
})

var waitUntilTestsAreFinished = function(page, callback) {
  var prevFinishedCount = 0

  var waitIntervalId = setInterval(function() {
    page.evaluate(function() {
      return document.getElementsByClassName("test").length
    }, function(currentFinishedCount) {
      if(prevFinishedCount == currentFinishedCount) {
        // count has not changed => tests are most likely done
        clearInterval(waitIntervalId)
        callback && callback()
      } else {
        // count has changed => save the current count and wait for next interval
        prevFinishedCount = currentFinishedCount
      }
    })
  }, 500)
}


var checkMochaResults = function(phantom, page) {
  waitUntilTestsAreFinished(page, function() {
    page.evaluate(function() {
      return document.getElementsByClassName("test fail").length
    }, function(failCount) {
      var exitCode = ((failCount == 0) ? 0 : 1)

      console.log('Failed specs: ' + failCount)
      console.log('Exit code: ' + exitCode)

      phantom.exit(exitCode)
    })
  })
}
