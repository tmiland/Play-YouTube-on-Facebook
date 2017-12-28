// ==UserScript==
// @name        Play YouTube on Facebook
// @description Play YouTube Videos on Facebook without leaving the site.
// @namespace   https://github.com/tmiland/Play-YouTube-on-Facebook
// @updateURL   https://github.com/tmiland/Play-YouTube-on-Facebook/raw/master/Play-YouTube-on-Facebook.user.js
// @version     1.3
// @date        27-12-2017
// @author      tmiland
// @match       https://www.facebook.com/*
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @grant       none
/* Thanks to https://chrome.google.com/webstore/detail/my-today-song-super-duper/mbnofkhnoflaknikohfaedmdaiafohpg for the code. :)
   I am not the author of this code, i have just modified it slightly to my likings, so i can use it as a userscript. */
//---------------------------
// 1.0 Added privacy option
// 1.1 Added width and height
// 1.2 Changed @namespace address
// 1.3 Updated Regex to match more YouTube URLs - 28.12.2017
// ==/UserScript==

	$(document).ready(function () {
		$(document).on("click", 'a', function (event) {
			var href = $(this).attr('href');
			href = getId(href);
			if (href == 'error') {
				return;
			}

			event.preventDefault();

			// pause all currently playing YouTube frames
			$('.youtube_frame').each(function(){
				this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
			}
		);
			// Old code for reference
			//$(this).replaceWith('<iframe class="youtube_frame"  src="//www.youtube.com/embed/' + href + '?autoplay=1&enablejsapi=1" frameborder="0" allowfullscreen></iframe>');
			$(this).replaceWith('<iframe type="text/html" width="474" height="360" class="youtube_frame" src="https://www.youtube-nocookie.com/embed/' + href + '?autoplay=1&enablejsapi=1" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>');
		});
		function getId(url) {
			var regExp = /(?:[?&]vi?=|\/embed\/|\/\d\d?\/|\/vi?\/|https?:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/;
			var match = url.match(regExp);

			if (match && match[1].length == 11) {
				return match[1];
			} else {
				return 'error';
			}
		}
	});