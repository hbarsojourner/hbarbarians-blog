---
layout: null
---
"use strict";

function loadAggregatePosts(elementId, feed, loadFullText, collection) {
  var hostElement = document.getElementById(elementId);
  var authorName;

  if (hostElement) {

    if (!feed) {
      feed = "https://feed.informer.com/digests/6MFAPGGVB3/feeder.rss";
    }

    getFeed(feed).then(function (result) {
      hostElement.innerHTML = "";

      var posts = result.items;
      posts.map(function (post) {
        var box = createNode('div');
        var external = createNode('div');
        var externalImage = createNode('img');
        var externalLink = createNode('a');
        var titleHeading = createNode('h1');
        var titleLink = createNode('a');
        var titleText = createNode('span');
        var content = createNode('span');
        var metadata = createNode('span');
        var postIsLocal = true;
        var postUrl = post.link;

        var recentFeed = null;

        box.classList.add("box");

        {% if jekyll.environment == "development" %}var isDevelopment = 1;{% endif %}
        var siteRegEx = new RegExp('{{site.identifier}}');
        if (!post.link.match(siteRegEx)) {
         postIsLocal = false;
        }

        if (!postIsLocal) {
          external.style.color = "blue";
          external.style.position = "relative";
          external.style.float = "right";
          external.style.top = "-8px";
          external.style.right = "-8px";
          externalLink.href = post.link;
          externalImage.setAttribute('src', "{{site.baseurl}}/assets/images/external-link.png");
          externalImage.style.width = "14px";
          externalImage.style.height = "14px";

          append(externalLink, externalImage);
          append(external, externalLink);
          append(box, external);
        }

        collection = collections.find(function (col) {
          if(col.postIdentifier) {
            var re = new RegExp(col.postIdentifier, 'g');
            return col.postIdentifier && post.link.match(re);
          } else {
            var regex = new RegExp('{{site.identifier}}/' + col.label);
            return post.link.match(regex);
          }
        });

        titleHeading.classList.add("post-title");
        if (postIsLocal) {
          titleLink.href = post.link;
        } else {

          if (collection) {
            recentFeed = collection.feed;
          }

          postUrl = "{{site.baseurl}}/external?guid=" + post.guid + "&feed=" + feed;

          if (recentFeed) {
            postUrl = postUrl + "&recentFeed=" + recentFeed;
          }

          titleLink.href = postUrl;
        }

        titleText.innerHTML = "" + post.title;
        titleLink.style.color = "#4a4a4a";
        append(titleLink, titleText);
        append(titleHeading, titleLink);
        append(box, titleHeading);

        authorName = collection && collection.name || post.author;

        metadata.innerHTML = "<span class=\"post-meta\">" + authorName + " -  " + new Date(post.pubDate.replace(/-/g, "/")).toLocaleString() + " <a style=\"color:grey\" href=" + post.link + "></a></span><hr/>";
        append(box, metadata);

        if (loadFullText) {
          content.innerHTML = post.content;
        } else {
          var postSummary = post.content.replace(/<(?:.|\n)*?>/gm, '').split(/\s+/).slice(0, 40).join(' ').trim();
          content.innerHTML = postSummary + " ... <a href=" + postUrl + ">Continue reading \u2192</a>";
        }
        content.classList.add("post-text");
        append(box, content);

        append(hostElement, box);
      });
    });
  }
}

