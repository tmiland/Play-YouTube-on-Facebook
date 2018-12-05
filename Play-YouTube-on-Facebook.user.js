// ==UserScript==
// @name        Play YouTube on Facebook
// @description Play YouTube Videos on Facebook without leaving the site.
// @namespace   https://github.com/tmiland/Play-YouTube-on-Facebook
// @updateURL   https://github.com/tmiland/Play-YouTube-on-Facebook/raw/master/Play-YouTube-on-Facebook.user.js
// @downloadURL https://github.com/tmiland/Play-YouTube-on-Facebook/raw/master/Play-YouTube-on-Facebook.user.js
// @supportURL  https://github.com/tmiland/Play-YouTube-on-Facebook/issues
// @version     2.1
// @date        05-12-2018
// @author      tmiland
// @match       https://www.facebook.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant       GM_addStyle
// @license MIT
// ==/UserScript==
/*----------------------------------Change-log-------------------------------------*\
| 1.0 Added privacy option                                                          |
| 1.1 Added width and height                                                        |
| 1.2 Changed @namespace address                                                    |
| 1.3 Updated Regex to match more YouTube URLs - 28.12.2017                         |
| 1.4 Added update and download URL                                                 |
| 1.5 Adjusted width, simplified the regExp and added support for new share links.  |
| 1.6 Updated regExp to match url with "-ISM" in the ID.                            |
| 1.7 Fixed a error in the regExp.                                                  |
| 1.8 Added a regExp to cover ALL URLs, adjusted width.                             |
| 1.9 Beautified the code. Removed references.                                      |
| 2.0 Changed URL due to browser error.                                             |
| 2.1 Found a better method from "YoutTube Player for Facebook"                     |
|     Extension for Google Chrome @ https://goo.gl/y6puXq /                         |
|     https://www.facebook.com/beesworkers                                          |
\*---------------------------------------------------------------------------------*/
/* old method 
  $(document).on("click", 'a', function (event) {
    var href = $(this).attr('href');
    href = getId(href);
    if (href == 'error') {
      return;
    }

    event.preventDefault();

    // pause all currently playing YouTube frames
    $('.youtube_frame').each(function () {
      this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
    $(this).replaceWith('<iframe type="text/html" width="476" height="360" class="youtube_frame" src="https://www.youtube.com/embed/' + href + '?autoplay=1&enablejsapi=1" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>');
  });
*/

let events = ['load'];

events.forEach((event) => {
  window.addEventListener(event, (e) => {
    addVideoTags();
  }, false);
});

function addVideoTags() {
  let youtubeLinks = [];
  const AllLinks = document.querySelectorAll('a[target="_blank"],a[href^="https://www.youtube.com"]');

  for (let i = 0; i < AllLinks.length; i++) {
    if (
      (
        ((AllLinks[i].href.indexOf('https%3A%2F%2Fwww.youtube.com%2FAttribution') > -1
          || AllLinks[i].href.indexOf('https%3A%2F%2Fwww.youtube.com%2Fattribution') > -1
          || AllLinks[i].href.indexOf('https%3A%2F%2Fwww.youtube.com%2Fwatch') > -1
          || AllLinks[i].href.indexOf('watch%253Fv%253D') > -1)
          || (AllLinks[i].href.indexOf('youtu.be') > -1 && AllLinks[i].href.length >= 28))
        || (AllLinks[i].href.indexOf('m.youtube.com') > -1 && AllLinks[i].href.indexOf('channel') == -1))
      && AllLinks[i].className !== ''
      && (!AllLinks[i].attributes['data-appname'] || AllLinks[i].attributes['data-appname'].value !== "YouTube")
      && AllLinks[i].href.indexOf('channel') == -1) {
      youtubeLinks.push(AllLinks[i]);
    }
  }

  for (let i = 0; i < youtubeLinks.length; i++) {
    let unclickable = findAncestor(youtubeLinks[i], 'unclickable');
    if (unclickable && options.showSuggestedTextShare) {
      let textarea = findAncestor(youtubeLinks[i], '_5h_u').querySelector('textarea');
      triggerEvent(textarea, 'keydown');
      triggerEvent(textarea, 'click');
      triggerEvent(textarea, 'keypress');
      textarea.selectionEnd = 0;

      let hiddenInput = findAncestor(youtubeLinks[i], '_5h_u').querySelector('.mentionsHidden');
    }

    let container = findAncestor(youtubeLinks[i], 'mtm') || findAncestor(youtubeLinks[i], '_3e7u') || findAncestor(youtubeLinks[i], '_10la') || findAncestor(youtubeLinks[i], '_3x-2') || findAncestor(youtubeLinks[i], '_52mr') || findAncestor(youtubeLinks[i], '_2r3x');

    let vidId = getVideoId(youtubeLinks[i]);

    if (container) {

      let elem = document.createElement('iframe');
      elem.className = "youtube_frame";
      elem.src = "https://www.youtube.com/embed/" + vidId;
      elem.width = container.offsetWidth;
      elem.height = container.offsetWidth * (5 / 9);
      elem.frameBorder = "0";
      elem.allowFullscreen = "true";

      if (container.offsetWidth >= 300) {
        container.parentElement.appendChild(elem);
        container.remove();
      }
    }
  }

  setTimeout(addVideoTags, 1000);
}

function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

function getVideoId(link) {
  if (link.href.indexOf("youtu.be") > -1 || link.href.indexOf("m.youtube.com") > -1) {
    if (link.href.indexOf('l.facebook.com') > -1) {
      if (link.href.indexOf("m.youtube.com") > -1)
        return link.href.substr(link.href.indexOf('v%3D') + 4, 11)
      else
        return link.href.substr(link.href.indexOf('be%2F') + 5, 11)
    } else {
      return link.href.substr(link.href.length - 11, link.href.length);
    }
  } else {
    let start;
    if (link.href.indexOf('v%3D') > -1) {
      start = link.href.indexOf('v%3D') + 4;
    } else {
      start = link.href.indexOf('v%253') + 6;
    }
    return link.href.substr(start, 11);
  }
}

/* Old method
  function getId(url) {
    if (url) {
      var regExp = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|v%3D|%2F|\/)([\w\-_]+)\&?/;
      var match = url.match(regExp);
      if (match && match.length > 1 && match[1].length == 11) {
        return match[1];
      }
      else {
        return 'error';
      }
    }
    return 'error';
  }
*/

function triggerEvent(el, type) {
  if ('createEvent' in document) {
    // modern browsers, IE9+
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  } else {
     return 'error';
  }
}