/*
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: keyboard.js
 * created: 24.03.2009
 * modified: 24.03.2009
 *
 */

;( function ( A, j ) {
	A.keyboard = function (  ) {
		return window.runtime.flash.ui.Keyboard;
	};
	A.keyboard.access = function (  ) {
		return window.runtime.flash.ui.Keyboard.isAccessible();
	};
	A.keyboard.caps = function ( ) {
		return window.runtime.flash.ui.Keyboard.capsLock;
	}
	A.keyboard.num = function ( ) {
		return window.runtime.flash.ui.Keyboard.numLock;
	}
	A.keyboard.lock = function ( ) {
		return A.keyboard.num() || A.keyboard.caps() ? true : false;
	}
	for( var k in window.runtime.flash.ui.Keyboard ) {
		if( A.type( window.runtime.flash.ui.Keyboard[k] ) == "string" )
			A.keyboard[k] = window.runtime.flash.ui.Keyboard[k];
	}
	A.mouse = function(){};
	A.mouse.show = function(){
		window.runtime.flash.ui.Mouse.show();
		$().trigger( 'air-mouse-show' );
	};
	A.mouse.hide = function(){
		window.runtime.flash.ui.Mouse.hide();
		$().trigger( 'air-mouse-hide' );
	};
	j.fn.mousehide = function ( ) {
		var that = this;
		this.hover( function(){
			A.mouse.hide();
		}, function(){
			A.mouse.show();
		} );
	}
} ) ( jQuery.air, jQuery );