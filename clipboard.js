/*
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: clipboard.js
 * created: 21.03.2009
 * modified: 24.03.2009
 *
 */

;( function ( A, j ) {
	
	var events = {
		
	};
	
	var formats = {
		'bitmap': window.runtime.flash.desktop.ClipboardFormats.BITMAP_FORMAT,
		'files': window.runtime.flash.desktop.ClipboardFormats.FILE_LIST_FORMAT,
		'html': window.runtime.flash.desktop.ClipboardFormats.HTML_FORMAT,
		'rich-text': window.runtime.flash.desktop.ClipboardFormats.RICH_TEXT_FORMAT,
		'text': window.runtime.flash.desktop.ClipboardFormats.TEXT_FORMAT,
		'url': window.runtime.flash.desktop.ClipboardFormats.URL_FORMAT
	};
	var clipboard = window.runtime.flash.desktop.Clipboard.generalClipboard;
	
	A.clipboard = function ( ) {
		if( arguments.length <= 3 && arguments.length > 0 && arguments[0].generalClipboard == undefined ) {
			this.o = clipboard;
			return this.data( arguments[0], arguments[1], arguments[3] );
		} else if ( arguments[0] && arguments[0].generalClipboard != undefined ) {
			this.o = arguments[0].generalClipboard;
			return this;
		} else {
			this.o = clipboard;//window.runtime.flash.desktop.Clipboard.Clipboard();
			return this;
		}
	};
	
	A.clipboard.formats = formats;
	
	A.clipboard.prototype.clear = function ( format  ) {
		format = format ? ( formats[format] ? formats[format] : format ) : formats.text;
		if( format )
			this.o.clearData ( format );
		else
			this.o.clear();
		return this;
	};
	A.clipboard.prototype.hasData = function ( format ) {
		if( format ) {
			format = format ? ( formats[format] ? formats[format] : format ) : formats.text;
			for( var i = 0; i < this.o.formats.length; i++ )
				if( this.o.formats[ i ] == format )
					return true;
			return false;
		} else {
			return (this.o.formats.length == 0 ) ? false : true; 
		}
	};
	A.clipboard.prototype.data = function ( format, value ) {
		format = format ? ( formats[format] ? formats[format] : format ) : formats.text;
		if( format && !value ) {
			var returns = this.o.getData( format );
			if( format == formats.file ) {
				if( returns == null )
					returns = [];
				else 
					returns = new jQuery.air.file( returns );
			} else if( format == formats.bitmap ) {
				
			}
			return returns;
		} else {
			if( format == formats.file ) {
				var files = [];
				if( A.type( value ) != 'array' )
					value = [value];
				$.each( value, function ( i, v ) {
					files.push( new jQuery.air.file( value ).get() );
				} );
				value = files;
			} else if( format == formats.bitmap ) {
				
			}
			this.o.setData( format, value );
			return this;
		}
	};
	
	A.clipboard.prototype.handler = function ( format, handler, serializable ) {
		serializable = serializable || serializable == undefined ? true : false;
		format = format ? ( formats[format] ? formats[format] : format ) : formats.text;
		handler = A.type( handler ) == 'function' ? handler : false;
		if( !handler ) return false;
		return this.o.setDataHandler(format, handler, serializable );
	};
	
	A.clipboard.prototype.has = function ( format ) {
		format = format ? ( formats[format] ? formats[format] : format ) : formats.text;
		if( !format ) return false;
		return this.o.hasFormat( format );
	};
	
	window.clipboard = A.clipboard.general = new A.clipboard( clipboard );
	j.fn.clipboard = A.clipboard;
	
	j(document).bind( 'copy', function( event ){
		if( !event.originalEvent || event.originalEvent.clipboard ) return;
		j().trigger( 'air-copy', [ jQuery.extend( {
			clipboard: new A.clipboard( event.originalEvent.clipboardData ),
			selection: window.getSelection()
		}, event ) ] );
	} ).bind( 'paste', function( event ) {
		if( !event.originalEvent || event.originalEvent.clipboard ) return;
		j().trigger( 'air-paste', [ jQuery.extend( {
			clipboard: new A.clipboard( event.originalEvent.clipboardData ),
			selection: window.getSelection()
		}, event ) ] );
	} ).bind( 'cut', function( event ){
		if( !event.originalEvent || event.originalEvent.clipboard ) return;
		j().trigger( 'air-cut', [ jQuery.extend( {
			clipboard: new A.clipboard( event.originalEvent.clipboardData ),
			selection: window.getSelection()
		}, event ) ] );
	} )
} )( jQuery.air, jQuery );