(function($) {
  var RSS = function(target, url, options, callback) {
    this.target = target
    this.url = url
    this.html = []
    this.options = jQuery.extend({
      ssl: false,
      limit: null,
      key: null,
      template: "<ul>{entry}<li><a href='{url}'>[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>{/entry}</ul>",
      tokens: {}
    }, options || {})
    this.callback = callback
  }

  RSS.prototype.load = function(callback) {
    var apiProtocol = "http" + (this.options.ssl ? "s" : "")
      , apiHost     = apiProtocol + "://ajax.googleapis.com/ajax/services/feed/load"
      , apiUrl      = apiHost + "?v=1.0&output=json_xml&callback=?&q=" + encodeURIComponent(this.url)
      , self        = this

    if (this.options.limit != null) apiUrl += "&num=" + this.options.limit;
    if (this.options.key != null)   apiUrl += "&key=" + this.options.key;

    $.getJSON(apiUrl, callback)
  }

  RSS.prototype.render = function() {
    var self             = this
      , templateMatch    = self.options.template.match(/\{entry\}(.*)\{\/entry\}/)
      , hasEntryTemplate = !!templateMatch
      , entryTemplate    = hasEntryTemplate ? templateMatch[1] : this.options.template

    this.load(function(data) {
      self.entries = data.responseData.feed.entries
      jQuery(self.entries).each(function() {
        var entry     = this
          , entryHTML = entryTemplate

        if(self.isRelevant(entry)) {
          jQuery(entryTemplate.match(/(\{.*?\})/g)).each(function() {
            var token = this.toString()
            entryHTML = entryHTML.replace(token, self.getValueForToken(token, entry))
          })

          self.html.push(entryHTML)
        }
      })

      var html = self.html.join("\n")

      if(hasEntryTemplate)
        html = self.options.template.replace(templateMatch[0], html)
      else
        html = (jQuery(html).length == 0) ? jQuery("<div>" + html + "</div>") : jQuery(html)

      self.target.append(html)
      if ($.isFunction(self.callback)) {
    	  self.callback.call(this);
      }
    })
  }

  RSS.prototype.isRelevant = function(entry) {
    var tokenMap = this.getTokenMap(entry)

    if(this.options.filter) {
      if(this.options.filterLimit && (this.options.filterLimit == this.html.length)) {
        return false
      } else {
        return this.options.filter(entry, tokenMap)
      }
    } else {
      return true
    }
  }

  RSS.prototype.getTokenMap = function(entry) {
    return jQuery.extend({
      url:            entry.link,
      author:         entry.author,
      date:           entry.publishedDate,
      title:          entry.title,
      body:           entry.content,
      shortBody:      entry.contentSnippet,
      bodyPlain:      entry.content.replace(/<\/?[^>]+>/gi, ''),
      shortBodyPlain: entry.contentSnippet.replace(/<\/?[^>]+>/gi, ''),
      teaserImage:    function(entry){
        try { return entry.content.match(/(<img.*?>)/gi)[0] }
        catch(e) { return "" }
      },
      teaserImageUrl: function(entry) {
        try { return entry.content.match(/(<img.*?>)/gi)[0].match(/src="(.*?)"/)[1] }
        catch(e) { return "" }
      },
      index:          jQuery.inArray(entry, this.entries),
      totalEntries:   this.entries.length
    }, this.options.tokens)
  }

  RSS.prototype.getValueForToken = function(_token, entry) {
    var tokenMap = this.getTokenMap(entry)
      , token    = _token.replace(/[\{\}]/g, '')
      , result   = tokenMap[token]

    if(typeof result != 'undefined')
      return ((typeof result == 'function') ? result(entry, tokenMap) : result)
    else
      throw new Error('Unknown token: ' + _token)
  }

  $.fn.rss = function(url, options, callback) {
    new RSS(this, url, options, callback).render()
  }
})(jQuery)