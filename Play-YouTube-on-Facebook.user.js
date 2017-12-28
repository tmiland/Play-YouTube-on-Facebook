/**
  The MIT License (MIT)

  Copyright (c) 2014 Jeppe Rune Mortensen

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
// ==UserScript==
// @name        Play YouTube on Facebook
// @description Play YouTube Videos on Facebook without leaving the site.
// @namespace   https://github.com/tmiland/Play-YouTube-on-Facebook
// @updateURL   https://github.com/tmiland/Play-YouTube-on-Facebook/raw/master/Play-YouTube-on-Facebook.user.js
// @downloadURL https://github.com/tmiland/Play-YouTube-on-Facebook/raw/master/Play-YouTube-on-Facebook.user.js
// @supportURL  https://github.com/tmiland/Play-YouTube-on-Facebook/issues
// @version     1.5
// @date        28-12-2017
// @author      tmiland
// @match       https://www.facebook.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant       none
/* Thanks to https://chrome.google.com/webstore/detail/my-today-song-super-duper/mbnofkhnoflaknikohfaedmdaiafohpg for the code. :)
   I am not the author of this code, i have just modified it slightly to my likings, so i can use it as a userscript. */
//---------------------------
// 1.0 Added privacy option
// 1.1 Added width and height
// 1.2 Changed @namespace address
// 1.3 Updated Regex to match more YouTube URLs - 28.12.2017
// 1.4 Added update and download URL
// 1.5 Adjusted width, simplified the regExp and added support for new share links.
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
			$(this).replaceWith('<iframe type="text/html" width="460" height="360" class="youtube_frame" src="https://www.youtube-nocookie.com/embed/' + href + '?autoplay=1&enablejsapi=1" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>');
		});
		function getId(url) {
			if(url){
			//var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var regExp = /(youtu.be\/|v[=]|v\/|v%3D)([a-zA-Z0-9]+)&?/;
			var match = url.match(regExp);
			if (match && match.length > 2 && match[2].length == 11) {
				return match[2];
				} else {
					return 'error';
				}
			}
		    return 'error';
		}
	});
