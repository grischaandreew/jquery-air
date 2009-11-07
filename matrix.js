/*
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: matrix.js
 * created: 24.03.2009
 * modified: 25.03.2009
 *
 */

;( function ( A, j ) {
	A.matrix = function ( a,b,c,d,tx,ty ) {
		//a:Number = 1, b:Number = 0, c:Number = 0, d:Number = 1, tx:Number = 0, ty:Number = 0
		a = a || 1;
		b = b || 0;
		c = c || 0;
		d = d || 1;
		tx = tx || 0;
		ty = ty || 0;
		this.matrix = new window.runtime.flash.geom.Matrix( a,b,c,d,tx,ty );
	};
	A.matrix.prototype.get = function ( ) {
		return this.matrix;
	};
	A.matrix.prototype.rotate = function ( angle ) {
		angle = parseFloat( angle );
		this.get().rotate( angle );
		return this;
	};
	A.matrix.prototype.translate = function ( dx, dy ) {
		dx = parseFloat( dx );
		dy = parseFloat( dy );
		this.get().translate( dx, dy );
		return this;
	};
	A.matrix.prototype.scale = function ( sx, sy ) {
		sx = parseFloat( sx );
		sy = parseFloat( sy );
		this.get().scale( sx, sy );
		return this;
	};
} ) ( jQuery.air, jQuery );