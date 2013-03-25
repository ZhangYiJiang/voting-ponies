// ==UserScript==
// @name        Voting Ponies 
// @namespace   yijiang
// @include     http://www.reddit.com/r/mylittlepony*
// @version     1.1
// ==/UserScript==

function inject () {
    var images = ['http://i.imgur.com/nXc1LOz.gif', 'http://i.imgur.com/jQ70FcY.gif', 
	'http://i.imgur.com/YIJWhes.gif', 'http://i.imgur.com/45wWH0C.gif'];

	// Preload images
	images.forEach(function(i){ 
		var img = new Image();
		img.src = i;
	});

	$('.arrow').each(function(){
		var ele = this, 
			$t = $(this), 
			walk = images[0], // Discentia by default 
			magic = images[1];

		// Only some posts are eligible for voting. For those that aren't, continue 
		if (this.onclick && this.onclick.toString().match(/vote\(\'(.*)\'/i)) {
			// Parse out the vote ID for later use 
			var id = this.onclick.toString().match(/vote\(\'(.*)\'/i)[1];
		} else {
			return true;
		}

		if ($t.hasClass('up') || $t.hasClass('upmod')) { // Use Karma if this is an upvote
			walk = images[2];
			magic = images[3];
		}
		
		$(this).click(function(evt){
			// Delay voting by 1.9 seconds until the middle of the magic cycle
			setTimeout(function(){
				$(ele).vote(id, null, evt);
			}, 1900);

			// Insert pony into document body, give it absolute position 
			var pony = $('<img>', {
				src: walk, 
				alt: '', 
				css: {
					position: 'absolute'
				}
			}).appendTo('body').offset({
				top: $t.parent().offset().top - 30, 
				left: $t.offset().left + 170
			})
			// Fade in anumation
			.hide().fadeIn({ duration: 200, queue: false })
			// 1.5x walk cycle, 200px distance in 1.0 second
			.animate({ left: '-=200px' }, 1000, 'linear', function(){
				// Change to magic cycle 
				pony.prop('src', magic);

				// Magic cycle lasts 1.3 seconds 
				setTimeout(function(){
					pony.prop('src', walk);
				}, 1300);
				
				// Fade out after walking away in 2.1 seconds (1.3s magic + 0.8s walk)
				setTimeout(function(){
					pony.fadeOut({ duration: 200, queue: false });
				}, 2100);

			// Walk out of frame in 1.0 seconds, covering 200px distance 
			}).delay(1300).animate({ left: '-=200px' }, 1000, 'linear', function(){
				// Clean up 
				$(this).remove();
			});
		});

		// Disable the default voting mechanism, since we're doing this ourselves 
		// THIS IS DANGEROUS - since if reddit suddenly change its voting code any
		// user of this script could suddenly find themselves unable to vote on things 
		this.onclick = '';
	});
}

// Script injection routine 
var s = document.createElement('script');
document.body.appendChild(s);
s.innerHTML = '(' + inject.toString() + ')()';
