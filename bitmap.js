/*
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: bitmap.js
 * created: 24.03.2009
 * modified: 25.03.2009
 *
 */

;( function ( A, j ) {
	A.bitmap = function ( w, h ) {
		this.bitmap = new window.runtime.flash.display.BitmapData( w, h );
	};
	A.bitmap.prototype.get = function ( ) {
		return this.bitmap;
	};
	A.bitmap.prototype.draw = function ( source, matrix, colorTransform, blendMode, clipRect, smoothing ) {
		//source:IBitmapDrawable, matrix:Matrix = null, colorTransform:ColorTransform = null, blendMode:String = null, clipRect:Rectangle = null, smoothing:Boolean = false
		this.get().draw( source, matrix, colorTransform, blendMode, clipRect, smoothing );
		return this;
	};
	A.bitmap.prototype.scale = function ( sx, sy ) {
		sx = sx ? parseFloat(sx) : 1;
		sy = sy ? parseFloat(sy) : sx;
		
		sx = sx > 1 ? sx / 100 : sx;
		sy = sy > 1 ? sy / 100 : sy;
		var bmp = this.get();
		var matrix = new $.air.matrix().scale(sx,sx).get();
		var nw = bmp.width * sx;
		var nh = bmp.height * sy;
		var bmp2 = new A.bitmap( nw, nh );
		return bmp2.draw( bmp, matrix );
	}
	A.bitmap.prototype.rotate = function ( angle ) {
		angle = angle ? parseFloat(angle) : 0;
		
		var bmp = this.get();
		var matrix = new $.air.matrix().rotate(angle).get();
		var nw = bmp.width;
		var nh = bmp.height;
		var bmp2 = new A.bitmap( nw, nh );
		return bmp2.draw( bmp, matrix );
	}
	A.bitmap.prototype.translate = function ( dx, dy ) {
		var bmp = this.get();
		var matrix = new $.air.matrix().translate(dx,dy).get();
		var nw = bmp.width;
		var nh = bmp.height;
		var bmp2 = new A.bitmap( nw, nh );
		return bmp2.draw( bmp, matrix );
	}
	
	/*
	 * decode the image to png
	 */
	A.bitmap.prototype.png = function ( ) {
		this.png = runtime.com.adobe.images.PNGEncoder.encode( this.get() );
		return this.png;
	};
	/*
	 * put the image as temp file and give the file url
	 *
	 */
	A.bitmap.prototype.src = function ( ) {
		var tmp = new A.file('desktop').create( 'tmp' );
		tmp.write( this.png() );
		return tmp.url();
	};
	/*
	 * returns a jquery object of temp image
	 */
	A.bitmap.prototype.image = function(){
		return $( '<img src="'+this.src()+'"/>' );
	};
	
} ) ( jQuery.air, jQuery );