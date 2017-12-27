// ==UserScript==
// @name        Play YouTube on Facebook
// @description Play YouTube Videos on Facebook without leaving the site.
// @namespace   https://gist.github.com/tmiland/e2a86addea3ef5900b4f5445e17e80ce
// @version     1.1
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
// ==/UserScript==
	(function() {
	'use strict';
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
			var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var match = url.match(regExp);

			if (match && match[2].length == 11) {
				return match[2];
			} else {
				return 'error';
			}
		}
	});
})();