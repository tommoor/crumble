/*
 * jQuery.crumble - A tour extension for grumble
 * Tom Moor, http://tommoor.com
 * Copyright (c) 2012 Tom Moor
 * MIT Licensed
 * @version 0.3
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
			distance: 30, 
			showAfter: 0,
			hasHideButton: false
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
		var pad = 100;
		
		if (top < windowTop) {
			$('html, body').animate({scrollTop: top - pad}, defaults.scrollSpeed);
		} else if (bottom > windowBottom) {
			$('html, body').animate({scrollTop: bottom - windowHeight + pad}, defaults.scrollSpeed);
		}
	};
	
	var getCurrentGrumble = function() {
		return $('.grumble').last().next();
	};
	
	var calculateAngle = function($element) {
		
		var windowTop = $(window).scrollTop();
		var centerX = window.innerWidth/2;
		var centerY = window.innerHeight/2;
		var elementX = $element.position().left;
		var elementY = $element.position().top+windowTop;
		var o = elementY-centerY;
		var a = elementX-centerX;
		var angle = Math.atan2(o, a) * (180/Math.PI);
		
		if (angle < 0) return angle-90;
		return angle+90;
	};
	
	var bindKeys = function() {
		
		// Pressing the escape key will stop the tour
		$(document).bind('keyup.crumble',function(ev){
			
			if(ev.keyCode === 27){
			
				ev.stopImmediatePropagation();
				methods.clear();
				$(document).unbind('keyup.crumble');
			}
		});
	};
	
	var methods = {
		init: function(o){
			
			// allow user to pass in an object and overwrite default args
			defaults = $.extend(defaults, o);
			
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
			bindKeys();
			
			return this;
		},
		
		go: function(pos) {
			// bound the position by the current setup
			position = Math.max(0, Math.min(pos, setup.length-1));
			
			// show this step
			this.step();
		},
		
		forward: function() {
			
			// move forward through the tour
			position++;
					
			// show the next step
			methods.step();
					
			// trigger any bound events
			defaults.onStep(position, setup[position]);
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
			
			// check if target exists, if not jump forward
			if (!$current.length) {
				methods.forward();
				return;
			}
			
			// everything looks good, continue through the tour
			var options = $.extend({}, defaults.grumble, current.options, {
				angle: current.options.angle || calculateAngle($current),
				onHide: function(){
					methods.forward();
				},
				onShow: function() {
					
					var $grumble = getCurrentGrumble();
					scrollToGrumble($grumble);
					$grumble.data('clicked', false);
					
					$grumble.click(function(ev){
						ev.stopImmediatePropagation();
						
						if (!$grumble.data('clicked')) {
							$grumble.data('clicked', true);
							$current.trigger('hide.bubble');
						}
					});
					
					$grumble.hover(function(){
						$grumble.prev().addClass('hover');
					}, function(){
						$grumble.prev().removeClass('hover');
					});
				}
			});
			
			// ensure distance is a number, otherwise this breaks
			options.distance = parseInt(options.distance, 10);
			
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