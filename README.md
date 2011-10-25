## jquery.rss

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

    $("#rss-feeds").rss("http://feeds.feedburner.com/premiumpixels", {
      // how many entries do you want? default: 4
      limit: 10,

      // will request the API via https; default: false
      ssl: true,

      // template for the html transformation
      // default: "<ul>{entry}<li><a href='{url}'>[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>{/entry}</ul>"
      template: "<div class='feed-container'>{entry}<p>{title}</p>{/entry}</div>",

      // additional token definition for in-template-usage
      // default: {}
      tokens: {
        foo: 'bar',
        bar: function(entry) { return entry.title }
      }
    })

## Templating

As seen in the options, you can specify a template in order to transform the json objects into HTML.
The basic format of that template is:

    "<outer-html>{entry}<entry-html></entry-html>{/entry}</outer-html>"

Using such a format, you can specify the structure of the entry-wise HTML, as well as the surrounding one.
If you specify a template, which has no "entry"-tokens, the templates gets treated as entry-wise template without
surrounding stuff.

So, let's say you have specified a limit of 2. Using the upper pseudo html. This will result in the following:

    <outer-html>
      <entry-html></entry-html>
      <entry-html></entry-html>
    </outer-html>

In order to get values for each entry, you can do something like this:

    "<div class='rss-feeds'><ul>{entry}<li>{title}</li>{/entry}</ul></div>"

The {title} token will get replaced by the actual title. So you will get this:

  <div class="rss-feeds">
    <ul>
      <li>Title 1</li>
      <li>Title 2</li>
    </ul>
  </div>

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

You can also define custom tokens using the ```tokens``` option:

    $('#foo').rss(url, {
      template: "{foo}, {bar}",
      tokens: {
        foo: function(entry){ return "dynamic-stuff: " + entry.title },
        bar: "static"
      }
    })

## Authors/Contributors

- DaWanda GmbH ([Website](http://dawanda.com))
- Sascha Depold ([Twitter](http://twitter.com/sdepold) | [Github](http://github.com/sdepold) | [Website](http://depold.com))
