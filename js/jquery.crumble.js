/*
 * jQuery.crumble - A tour extension for grumble
 * Tom Moor, http://tommoor.com
 * Copyright (c) 2012 Tom Moor
 * MIT Licensed
 * @version 0.1
 */

(function($){

var Crumble = function(){
	  
	// locals
	var position = 0;
	var setup = [];
	var $setup;
	
	var defaults = {
		grumble: {
			text: '',
			angle: 85, 
			distance: 20, 
			showAfter: 0,
			hasHideButton: true
		},
		scrollSpeed: 'fast',
		onStep: function(){},
		onStart: function(){},
		onFinish: function(){}
	};
	
	var scrollToGrumble = function($grumble) {
		
		var top = $grumble.position().top;
		var bottom = $grumble.height() + top;
		var windowHeight = $(window).innerHeight();
		var windowTop = $(window).scrollTop();
		var windowBottom = windowHeight + windowTop;
		var pad = 50;
		
		if (top < windowTop) {
			$('html, body').animate({scrollTop: top - 50}, defaults.scrollSpeed);
		} else if (bottom > windowBottom) {
			$('html, body').animate({scrollTop: bottom - windowHeight + 50}, defaults.scrollSpeed);
		}
	};
	
	var getCurrentGrumble = function() {
		return $('.grumble').last();
	};
    
	var methods = {
		init: function(o){
			
			// parse setup
			$('li', this).each(function(index, stop){
				
				var $stop = $(stop);
				var opt = $stop.data('options');
				var options = {};
				
				// contents of node becomes the grumble text
				options.text = $stop.html();
				
				// optionally angle is in data-angle
				options.angle = $stop.data('angle');
				
				// other options contained in data-options
				if (opt) {
					var j;
					var data = opt.split(';');
				
					for (var i in data) {
						j = data[i].split(':');
					
						if (j.length === 2) {
							options[j[0]] = j[1];
						} else {
							// invalid format
							continue;
						}
					}
				}
				
				// push this step into the current setup
				setup.push({
					target: $stop.data('target'),
					options: options
				});
			});
			
			methods.clear();
			methods.step();
			
			return this;
		},
		
		go: function(pos) {
			// bound the position by the current setup
			position = Math.max(0, Math.min(pos, setup.length-1));
			
			// show this step
			this.step();
		},
		
		step: function() {
			
			// if we're at the start, trigger an event
			if (position === 0) {
				defaults.onStart();
			}
			
			// if we've reached the end, trigger an event
			// and reset back to the beginning
			if (position >= setup.length) {
				methods.clear();
				defaults.onFinish();
				return;
			}
			
			var current = setup[position];
			var $current = $(current.target).first();
			
			// check we have a target for this step
			if (!current.target) {
				$.error('Crumble step does not include data-target property');
				return;
			}
			
			// check if target exists
			if (!$current.length) {
				// move forward through the tour
				position++;
					
				// show the next step
				methods.step();
					
				// trigger any bound events
				defaults.onStep(position);
				return;
			}
			
			// everything looks good, continue through the tour
			var options = $.extend({}, defaults.grumble, current.options, {
				onHide: function(){
					
					// move forward through the tour
					position++;
					
					// show the next step
					methods.step();
					
					// trigger any bound events
					defaults.onStep(position);
				},
				onShow: function() {
					
					var $grumble = getCurrentGrumble();
					scrollToGrumble($grumble);
				}
			});
			
			$current.grumble(options);
		},
		
		clear: function() {
			
			// reset counter back to the beginning
			position = 0;
			
			// clear up all created DOM elements
			$('.grumble, .grumble-text, .grumble-button').remove();
		}
	};

	return methods;
};


$.fn.crumble = function(method) {
	
	// so that arguments are accessible within each closure
	var args = arguments;

	return this.each(function(){
		var state = $(this).data('Crumble');

		// Method calling logic
		if (state && state[method] ) {
			state[ method ].apply( this, Array.prototype.slice.call( args, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			
			// create new tinyrange
			var tr = (new Crumble(this));
			tr.init.apply( this, args );
			
			// save state in jquery data
			$(this).data('Crumble', tr);
		
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.crumble' );
		}
	});
};

})(jQuery);