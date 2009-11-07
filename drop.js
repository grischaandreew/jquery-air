/*
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: drop.js
 * created: 22.03.2009
 * modified: 24.03.2009
 *
 */

;( function ( A, j ) {
	var formats = {
		'bitmap': window.runtime.flash.desktop.ClipboardFormats.BITMAP_FORMAT,
		'files': window.runtime.flash.desktop.ClipboardFormats.FILE_LIST_FORMAT,
		'html': window.runtime.flash.desktop.ClipboardFormats.HTML_FORMAT,
		'rich-text': window.runtime.flash.desktop.ClipboardFormats.RICH_TEXT_FORMAT,
		'text': window.runtime.flash.desktop.ClipboardFormats.TEXT_FORMAT,
		'urls': window.runtime.flash.desktop.ClipboardFormats.URL_FORMAT
	};
	A.drop = function ( drop, options ) {
		drop = j( drop );
		options = j.extend( options || {}, {
			allow: false
		} );
		if( options.allow == false ) options.allow = types;
		if( A.type( options.allow ) == "string" ) options.allow = [options.allow];
		var allowed = [];
		$.each( options.allow, function ( i, k ) {
			allowed.push( formats[k] ? formats[k] : k );
		} );
		options.allow = allowed;
		drop.bind( "dragenter", function(event){event.preventDefault();} )
			.bind( "dragover", function(event){event.preventDefault();} )
			.bind( "drop", function(event){
				var data = {}, founded = 0;
				$.each( options.allow, function ( i, n ){
					if( A.type( i ) == "string" )
						data[ i ] = event.dataTransfer.getData( n );
					else
						data[ n ] = event.dataTransfer.getData( n );
					founded++;
				} );
				if( founded > 0 )
					drop.trigger( 'air-drop', [ data, event, founded ] );
			} );
	}

	j.fn.air.drop = function( options ) {
		this.addClass( 'air-dropable' );
		this.data( 'air-drop', new A.drop( this, options ) );
	};
	j.fn.air.nodrag = function ( ) {
		this.each( function( i,e ) {
			$(e).css( {
				'-webkit-user-drag': 'none'
			} );
		} );
	};
	j.fn.air.noselect = function ( ) {
		this.each( function( i,e ) {
			$(e).css( {
				'-webkit-user-select': 'none'
			} );
		} );
	}
} ) ( jQuery.air, jQuery );