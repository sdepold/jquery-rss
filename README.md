# jquery.rss

This plugin can be used to read a RSS feed (via the Google Feed API) and transform it into a custom piece of HTML.

## Setup

    <!DOCTYPE html>
    <html>
      <head>
        <title>jquery.rss example</title>
        <script src="lib/jquery-1.6.4.min.js"></script>
        <script src="src/jquery.rss.js"></script>
        <script>
          jQuery(function($) {
            $("#rss-feeds").rss("http://feeds.feedburner.com/premiumpixels")
          })
        </script>
      </head>
      <body>
        <div id="rss-feeds"></div>
      </body>
    </html>

## Options

    $("#rss-feeds").rss(
      "http://feeds.feedburner.com/premiumpixels",
      {
        // how many entries do you want?
        // default: 4
        // valid values: any integer
        limit: 10,

        // will request the API via https
        // default: false
        // valid values: false, true
        ssl: true,

        // outer template for the html transformation
        // default: "<ul>{entries}</ul>"
        // valid values: any string
        layoutTemplate: '<div class='feed-container'>{entries}</div>',

        // inner template for each entry
        // default: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>'
        // valid values: any string
        entryTemplate: '<p>{title}</p>',

        // additional token definition for in-template-usage
        // default: {}
        // valid values: any object/hash
        tokens: {
          foo: 'bar',
          bar: function(entry, tokens) { return entry.title }
        },

        // output mode of google feed loader request
        // default: 'json'
        // valid values: 'json', 'json_xml'
        outputMode: 'json_xml',

        // the effect, which is used to let the entries appear
        // default: 'show'
        // valid values: 'show', 'slide', 'slideFast', 'slideSynced', 'slideFastSynced'
        effect: 'slideFastSynced',

        // a callback, which gets triggered when an error occures
        // default: function() { throw new Error("jQuery RSS: url don't link to RSS-Feed") }
        error: function(){},

        // a callback, which gets triggered when everything was loaded successfully
        // this is an alternative to the next parameter (callback function)
        // default: function(){}
        success: function(){}
      },

      // callback function
      // called after feeds are successfully loaded and after animations are done
      function callback() {}
    )

## Templating

As seen in the options, you can specify a template in order to transform the json objects into HTML. In order to that, you can either define the outer template (which describes the html around the entries) or the entry template (which describes the html of an entry).

The basic format of those templates are:

    # layoutTemplate:
    "<outer-html>{entries}</outer-html>"

    # entryTemplate:
    "<any-html>{token1}{token2}</any-html>"

So, let's say you have specified a limit of 2, using the upper pseudo html. This will result in the following:

    <outer-html>
      <any-html>{token1}{token2}</any-html>
      <any-html>{token1}{token2}</any-html>
    </outer-html>

There are some predefined tokens:

- url: the url to the post
- author: the author of the post
- date: the publishing date
- title: the title of the post
- body: the complete content of the post
- shortBody: the shortened content of the post
- bodyPlain: the complete content of the post without html
- shortBodyPlain: the shortened content of the post without html
- teaserImage: the first image in the post's body
- teaserImageUrl: the url of the first image in the post's body
- index: the index of the current entry
- totalEntries: the total count of the entries
- feed: contains high level information of the feed (e.g. title of the website)

You can also define custom tokens using the ```tokens``` option:

    $('#foo').rss(url, {
      entryTemplate: "{dynamic}, {static}, {re-use}",
      tokens: {
        dynamic: function(entry, tokens){ return "dynamic-stuff: " + entry.title },
        "re-use": function(entry, tokens){ return encodeURIComponent(tokens.teaserImageUrl) },
        static: "static"
      }
    })

Please make sure to NOT define infinite loops. The following example is really BAD:

    $('#foo').rss(url, {
      entryTemplate: "{loop}",
      tokens: {
        whoops: function(entry, tokens) { return tokens.loop() }
        loop: function(entry, tokens) { return tokens.whoops() }
      }
    })

Here is a real-world example:

    $('#foo').rss(url, {
      layoutTemplate: "<table><tr><th>Title</th></tr>{entries}</table>",
      entryTemplate:  "<tr><td>{title}</td></tr>"
    })

## Filtering

The plugin also allows you to filter specific entries in order to only print them:

    $("#foo").rss(url, {
      limit: 100,
      filterLimit: 10,
      filter: function(entry, tokens) {
        return tokens.title.indexOf('my filter') > -1
      }
    })

This will request 100 entries via the Feed API and renders the first 10 matching entries.

## Testing

The test suite is using BusterJS. To execute the tests you need to run a buster server, capture a browser and finally do `npm test`. The server can be started via `node_modules/.bin/buster server`. Afterwards open `http://localhost:1111/capture`.

## Authors/Contributors

- DaWanda GmbH ([Website](http://dawanda.com))
- Sascha Depold ([Twitter](http://twitter.com/sdepold) | [Github](http://github.com/sdepold) | [Website](http://depold.com))
- Steffen Schröder  ([Twitter](http://twitter.com/ChaosSteffen) | [Github](http://github.com/ChaosSteffen) | [Website](http://schroeder-blog.de))

## Misc

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/sdepold/jquery-rss/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
