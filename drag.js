/*
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: drag.js
 * created: 22.03.2009
 * modified: 24.03.2009
 *
 */


;( function ( A, j ) {
	A.drag = function ( drag, options ) {
		drag = j( drag );
		options = j.extend( options, {
			effectAllowed: "copy",
			
		} );
		drag.bind( "dragstart", function(event){
				event.dataTransfer.effectAllowed = options.effectAllowed;
				drag.trigger( 'air-drag-start', [ event ] );
			} )
			.bind( "dragend", function(){
				A.log(event.type, event.dataTransfer.dropEffect, event );
				drag.trigger( 'air-drag-end', [ event ] );
			} )
	}

	j.fn.air.drag = function( options ) {
		this.css( {
			'-webkit-user-drag': 'element'
		} ).addClass( 'air-dragable' );
		this.data( 'air-drag', new A.drag( this, options ) );
	};
} ) ( jQuery.air, jQuery );