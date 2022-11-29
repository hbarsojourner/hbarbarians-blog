---
layout: null
---
"use strict";

function loadRecentPosts(elementId) {
  var hostElement = document.getElementById(elementId);

  if (hostElement) {

    var feed = "https://feed.informer.com/digests/6MFAPGGVB3/feeder.rss";
    var recentFeed = feed;

    getFeed(feed).then(function (result) {
      hostElement.innerHTML = "";

      var posts = result.items.slice(0, 10);
      posts.map(function (post) {
        var li = createNode('li'),
            anchor = createNode('a'),
            span = createNode('span');
        if (post.link.startsWith("{{site.url}}")) {
          anchor.href = post.link;
        } else {
          var collection = collections.find(function (col) {
            var re = new RegExp(col.postIdentifier, 'g');
            return col.postIdentifier && post.link.match(re);
          });

          if (collection) {
            recentFeed = collection.feed;
          }

          // this creates a mis-match between the guid and the feed
          anchor.href = "{{site.baseurl}}/external?guid=" + post.guid + "&feed=" + feed + "&recentFeed=" + recentFeed;
        }

        span.innerHTML = post.title;
        append(li, anchor);
        append(anchor, span);
        append(hostElement, li);
      });
    });
  }
}

