/*
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: request.js
 * created: 25.03.2009
 * modified: 09.04.2009
 *
 */

;(function( A, j ) {
	
	var responseTypes = {
		text: window.runtime.flash.net.URLLoaderDataFormat.TEXT,
		binary: window.runtime.flash.net.URLLoaderDataFormat.BINARY,
		variables: window.runtime.flash.net.URLLoaderDataFormat.VARIABLES
	};
	
	var mainOptions = {
		cookies: true,
		cache: true,
		followRedirects: true,
		method: 'GET',
		userAgent: 'jQuery.AIR (http://code.google.com/p/jquery-air/)',
		contentType: 'application/x-www-form-urlencoded',
		responseType: window.runtime.flash.net.URLLoaderDataFormat.TEXT,
		responseTypeEncoding: "application/xml",
		xml: null,
		auth: {
			host: null,
			name: null,
			password: null
		},
		headers: {
			'X-Requested-With': null,
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Language': 'de-de,de;q=0.8,en-us;q=0.5,en;q=0.3',
			'Accept-Encoding': 'gzip,deflate',
			'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
			'Keep-Alive': '300',
			'Connection': 'keep-alive'
		},
		triggerEventsGlobal: true
	};
	var events = {
		complete: window.runtime.flash.events.Event.COMPLETE,
		ioerror: window.runtime.flash.events.IOErrorEvent.IO_ERROR,
		securityerror: window.runtime.flash.events.SecurityErrorEvent.SECURITY_ERROR,
		progress: window.runtime.flash.events.ProgressEvent.PROGRESS
	};
	A.request = function( options ) {
		var that = this;
		this.__eventListeners = new Object();
		this.options = {};
		options = typeof( options ) == "string" ? {url:options} : options;
		this.xhr = new window.runtime.flash.net.URLLoader( );
		this.request = new window.runtime.flash.net.URLRequest ( options.url );
		
		
		this.xhr.addEventListener( events.complete, function ( event ) {
			that.trigger( 'air.success' ,[event.target.data, event] );
		} );

		this.xhr.addEventListener( events.ioerror, function ( event ) {
			that.trigger( 'air.exception', [ event ] );
			that.trigger( events.ioerror, [ event ] );
		} );

		this.xhr.addEventListener( events.securityerror, function ( event ) {
			that.trigger( 'air.exception', [ event ] );
			that.trigger( events.securityerror, [ event ] );
		} );
		
		this.xhr.addEventListener( events.progress, function ( event ) {
			var status = Math.round( (event.bytesTotal/event.bytesLoaded)*100 );
			that.trigger( 'air.progress', [ status, event.bytesLoaded, event.bytesTotal, event ] );
		} );	
		this.setOptions( options );
	};
	A.request.prototype.url = function ( ) {
		
	};
	A.request.prototype.setOptions = function( options ) {
		options = options || {};
		if( A.type( options ) == "string" )
			options = {data: options};
		this.options = j.extend( j.extend( mainOptions, this.options ), options );
		var data = this.options.data, url = this.options.url, method = this.options.method;
		
		this.request = new window.runtime.flash.net.URLRequest ( this.options.url );
		
		this.request.cacheResponse = this.options.cache;
		this.request.useCache = this.options.cache;
		this.request.userAgent = this.options.userAgent;
		this.request.followRedirects = this.options.followRedirects;
		this.request.manageCookies = this.options.cookies;
		this.request.contentType = this.options.contentType;
		
		var variables = new window.runtime.flash.net.URLVariables ( );
		if( data ) {
			if( A.type( data ) == "string" ) {
				var d = {};
				var k = data.split( '&' );
				k.each( function ( kk ) {
					var t = kk.split( '=' );
					d[ t[ 0 ] ] = t[ 1 ];
				} );
				data = d;
			}
			for( var key in data ) {
				if( data[key] )
				variables[ key ] = data[ key ];
			}
			this.request.data = variables;
		}
		if( this.options.raw ) {
			this.request.data = this.options.raw;
			//this.request.contentType = 'application/xml';
		}
		
		if( this.options.headers ) {
			for( var key in this.options.headers ) {
				if( this.options.headers[key] )
				this.request.requestHeaders.push( new window.runtime.flash.net.URLRequestHeader ( key, this.options.headers[ key ] ) );
			}
		}

		if( this.options.auth.name && this.options.auth.password ) {
			window.runtime.flash.net.URLRequestDefaults.setLoginCredentialsForHost ( this.options.auth.host, this.options.auth.name, this.options.auth.password  );
			this.request.authenticate = true;
		}
		this.request.method = this.options.method.toUpperCase();
		this.xhr.dataFormat = this.options.responseType;
		
		if(this.options.triggerEventsGlobal) {
			this.bind( 'air.success', function(){$(document).trigger('air.request.success',arguments)} );
			this.bind( 'air.progress', function(){$(document).trigger('air.request.progress',arguments)} );
			this.bind( 'air.exception', function(){$(document).trigger('air.request.exception',arguments)} );
		}
			
		
	};
	
	A.request.prototype.load = function( ) {
		try {
			this.xhr.load( this.request );
		} catch ( e ) {
			this.trigger('exception', [ e, this.xhr ] );
		}
		this.trigger('request');
	};
	
	A.request.prototype.header = function() { };
	
	A.request.prototype.bind = function ( type, fn ) {
		type = events[ type ] ? events[ type ] : type;
		if( type && A.type( fn ) == "function" ) {
			if( !this.__eventListeners[ type ] ) this.__eventListeners[ type ] = [];
			this.__eventListeners[ type ].push( fn );
			this.xhr.addEventListener( type, fn );
		} else if( type &&  A.type( fn ) == 'array' ) {
			var that = this;
			$.each( fn, function( i, f ) { that.bind( type, f ) } );
		}
		return this;
	};
	A.request.prototype.unbind = function ( tpye, fn ) {
		var that = this;
		type = events[ type ] ? events[ type ] : type;
		if( type && A.type( fn ) == "function" ) {
			this.xhr.removeEventListener( type, fn );
			if( !this.__eventListeners[ type ] ) this.__eventListeners[ type ] = [];
			$.each( this.__eventListeners[ type ], function( i, f ) {
				if( f == fn )
					delete that.__eventListeners[ type ][ i ];
			} )
		} else if( type &&  A.type( fn ) == 'array' ) {
			var that = this;
			$.each( fn, function( i, f ) { that.unbind( type, f ) } );
		} else if( type && fn == undefined ) {
			$.each( this.__eventListeners[ type ], function( i, f ) {
				that.xhr.removeEventListener( type, f );
			} );
			this.__eventListeners[ type ] = [];
		}
		return this;
	};
	A.request.prototype.trigger = function ( type, args ) {
		var that = this;
		args = args || [];
		if( type && this.__eventListeners[ type ] ) {
			var w = true;
			$.each( this.__eventListeners[ type ], function ( i, f ) {
				if( w == true  )
					if( f.apply( that, args  ) === false ) w = false;
			} );
		}
		return this;
	}
})( jQuery.air, jQuery );