/*
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: file.js
 * created: 21.03.2009
 * modified: 24.03.2009
 *
 */

;( function ( A, j ) {
	var pathSeperator = window.runtime.flash.filesystem.File.separator;
	var directory = {
		'user': window.runtime.flash.filesystem.File.userDirectory,
		'app' : window.runtime.flash.filesystem.File.applicationDirectory,
		'store': window.runtime.flash.filesystem.File.applicationStorageDirectory,
		'desktop': window.runtime.flash.filesystem.File.desktopDirectory,
		'documents': window.runtime.flash.filesystem.File.documentsDirectory,
		'root': window.runtime.flash.filesystem.File.getRootDirectories
	};
	var types = {
		SYNC: 'sync',
		ASYNC: 'async'
	};
	var type = types.ASYNC;
	
	var events = {
		'activate': window.runtime.flash.events.Event.ACTIVATE,
		'deactivate': window.runtime.flash.events.Event.DEACTIVATE,
		
		'open': window.runtime.flash.events.FileReference.OPEN,
		'progress': window.runtime.flash.events.FileReference.PROGRESS,
		
		'cancel': window.runtime.flash.events.Event.CANCEL,
		'complete': window.runtime.flash.events.Event.COMPLETE,
		
		'directoryListing': window.runtime.flash.events.FileListEvent.DIRECTORY_LISTING,
		'listing': window.runtime.flash.events.FileListEvent.DIRECTORY_LISTING,
		
		'ioError': window.runtime.flash.events.IOErrorEvent.IO_ERROR,
		'securityError':  window.runtime.flash.events.SecurityErrorEvent.SECURITY_ERROR,
		
		'select': window.runtime.flash.events.Event.SELECT,
		'selectMultiple':  window.runtime.flash.events.FileListEvent.SELECT_MULTIPLE
	};
	
	
	A.file = function ( p ) {
		return this.init( p );
	};
	
	A.file.prototype.init = function ( p ) {
		var that = this;
		if( !p ) { p = directory.store; }
		if( p.o != undefined && p.o.browseForOpenMultiple != undefined ) return p;
		if( A.type( p ) == 'string' && directory[ p.toLowerCase() ] ) {
			this.o = directory[ p.toLowerCase() ];
		} else if( A.type( p ) == "string" ) {
			this.o = new window.runtime.flash.filesystem.File( p );
		} else if( A.type( p ) == "array" || ( p.length != undefined && p.size == undefined && A.type( p ) != 'string' ) ) {
			var r = [];
			for( var i = 0; i < p.length; i++ )
				r.push( new A.file( p[i] ) );
			return r;
		}
		else if( p.browseForOpenMultiple ) {
			this.o = p;
		}
		if( this.o == undefined ) return undefined;
		this.__eventListeners = new Object();
		this.stream = new window.runtime.flash.filesystem.FileStream ( );
		this.bind( 'ioError', function ( ) {
			that.trigger( 'error', arguments );
		} ).bind( 'securityError', function ( ) {
			that.trigger( 'error', arguments );
		} );
	};
	A.file.prototype.get = function ( ) {
		return this.o;
	}
	
	A.file.prototype.create = function ( type ) {
		
		switch( String( type ).toLowerCase() ) {
			case 'directory':
				return new A.file( window.runtime.flash.filesystem.File.createDirectory() );
			break;
			case 'tmp-directory':
				return new A.file( window.runtime.flash.filesystem.File.createTempDirectory() );
			break;
			case 'tmp':
			default:
				return new A.file( window.runtime.flash.filesystem.File.createTempFile() );
			break;
		}
		
		return this;
	};

	A.file.prototype.remove = function ( withContent, cb ) {
		var w = withContent == true || withContent == false ? withContent : true,
			c = A.type( withContent ) == 'function' ? c : A.type( cb ) == 'function' ? cb : function(){},
			that = this,
			handler = function ( ) {
				that.unbind( 'complete', handler );
				cb.apply( that, [] );
				that.trigger( 'remove' );
			};
		if( this.is( 'directory' ) ) {
			if( type == types.SYNC ) {
				this.o.deleteDirectory( w );
				handler( );
			} else {
				this.bind( 'complete', handler );
				this.o.deleteDirectoryAsync( w );
			}
		} else {
			if( type == types.SYNC ) {
				this.o.deleteFile();
				handler( );
			} else {
				this.bind( 'complete', handler );
				this.o.deleteFileAsync();
			}
		}
		return this;
	};
	A.file.prototype.trash = function ( cb ) {
		cb = cb || function(){},
		that = this,
		handler = function ( ) {
			that.unbind( 'complete', handler );
			cb.apply( that, [] );
			that.trigger( 'trash' );
		};
		if( type == types.SYNC ) {
			this.o.moveToTrash();
			handler( );
		} else {
			this.bind( 'complete', handler );
			this.o.moveToTrashAsync();
		}
		return this;
	};
	A.file.prototype.copy = function ( l, overide, cb ) {
		var n = overide == true || overide == false ? overide : l == true || l == false ? l : true,
			c = l !== n && ( l.o || l[0] ) ? new A.file( l ) : false,
			that = this,
			handler = function ( ) {
				that.unbind( 'complete', handler );
				if( A.type(  cb ) == 'function' )
					cb.apply( that, [] );
				that.trigger( 'copy' );
			};
		if( type == types.SYNC ) {
			this.o.copyTo( c, n );
			handler( );
		} else {
			this.bind( 'complete', handler );
			this.o.copyToAsync( c, n );
		}
		return this;
	};
	A.file.prototype.move = function ( l, overide, cb ) {
		var n = overide == true || overide == false ? overide : l == true || l == false ? l : true,
			c = l !== n && ( l.o || l[0] ) ? new A.file( l ) : false,
			that = this,
			handler = function ( ) {
				that.unbind( 'complete', handler );
				if( A.type( cb )== 'function' )
					cb.apply( that, [] );
				that.trigger( 'move' );
			};
		if( type == types.SYNC ) {
			this.o.moveTo( c, n );
			handler( );
		} else {
			this.bind( 'complete', handler );
			this.o.moveToAsync( c, n );
		}
		return this;
	};
	A.file.prototype.parent = function ( ) {
		return new A.file( this.o.parent );
	};
	A.file.prototype.dir = function ( ) {
		if( this.is( 'directory' ) )
			return this;
		else {
			return new A.file( this.o.parent );
		}
	};
	A.file.prototype.name = function ( ) {
		return this.attr( 'name' );
	}
	A.file.prototype.size = function ( ) {
		return this.attr( 'size' );
	}
	A.file.prototype.attr = function ( n ) {
		if( n )
			return this.o[ n ];
		return this;
	}
	A.file.prototype.resolve = function ( n ) {
		if( A.type( n ) == 'string' )
			this.o = this.o.resolvePath( n );
		return this;
	};
	A.file.prototype.path = function ( n ) {
		if( !n ) return this.o.path.nativePath;
		else return this.resolve( n );
	};
	A.file.prototype.url = function ( ) {
		return this.o.url;
	};
	A.file.prototype.files = function ( cb ) {
		cb = cb || function(){},
		that = this,
		handler = function ( files ) {
			d.unbind( 'directoryListing', handler );
			files = files ? files.files || files : [];
			files = new A.file( files );
			cb.apply( d, [files] );
		};
		var d = this.dir();
		if( type == types.SYNC ) {
			handler( d.o.getDirectoryListing() );
		} else {
			d.bind( 'directoryListing', handler );
			d.o.getDirectoryListingAsync();
		}
		return this;
	};
	A.file.prototype.stop = function ( ) {
		this.o.cancel();
		return this;
	};
	
	A.file.prototype.bind = function ( type, fn ) {
		type = events[ type ] ? events[ type ] : type;
		if( type && A.type( fn ) == "function" ) {
			if( !this.__eventListeners[ type ] ) this.__eventListeners[ type ] = [];
			this.__eventListeners[ type ].push( fn );
			this.o.addEventListener( type, fn );
		} else if( type &&  A.type( fn ) == 'array' ) {
			var that = this;
			$.each( fn, function( i, f ) { that.bind( type, f ) } );
		}
		return this;
	};
	A.file.prototype.unbind = function ( tpye, fn ) {
		var that = this;
		type = events[ type ] ? events[ type ] : type;
		if( type && A.type( fn ) == "function" ) {
			this.o.removeEventListener( type, fn );
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
				that.o.removeEventListener( type, f );
			} );
			this.__eventListeners[ type ] = [];
		}
		return this;
	};
	A.file.prototype.trigger = function ( type ) {
		var that = this;
		if( type && this.__eventListeners[ type ] ) {
			var w = true;
			$.each( this.__eventListeners[ type ], function ( i, f ) {
				if( w == true  )
					if( f.apply( that, []  ) === false ) w = false;
			} );
		}
		return this;
	}
	
	A.file.prototype.roots = function (  ) {
		return new A.file( directory.root )
	};
	A.file.prototype.exists = function ( ) {
		return this.o.exists;
	};
	A.file.prototype.is = function ( n ) {
		n = n.slice(0,1).toUpperCase() + n.slice(1).toLowerCase();
		try {
			return this.o[ 'is' + n ];
		} catch( e ) {
			return false;
		}
	};
	A.file.prototype.open = function ( mode, cb, pr ) {
		var w = A.type( mode ) == 'string' && window.runtime.flash.filesystem.FileMode[ mode.toUpperCase() ] ? window.runtime.flash.filesystem.FileMode[ mode.toUpperCase() ]  : window.runtime.flash.filesystem.FileMode[ 'UPDATE' ],
			c = A.type( mode ) == 'function' ? mode : A.type( cb ) == 'function' ? cb : function(){},
			pcb = A.type( pr ) == 'function' ? pr : function(){},
			eHandler = pcb,
			that = this,
			handler = function ( event ) {
				that.stream.removeEventListener( 'complete', handler );
				that.stream.removeEventListener( 'progress', pcbHandler );
				that.stream.removeEventListener( 'ioError', eHandler );
				cb.apply( that, [new A.bytes(event.currentTarget), event] );
				that.trigger( 'open-stream' );
			},
			pcbHandler = function ( ) {
				pcb.apply( that, arguments );
				that.trigger( 'progress-stream', arguments );
			},
			ehandler = function ( ) {
				
				that.trigger( 'progress-error', arguments );
			};
		if( type == types.SYNC ) {
			handler( this.stream.open( this.o, w ) );
		} else {
			this.stream.addEventListener( 'open', handler );
			this.stream.addEventListener( 'progress', handler );
			this.stream.addEventListener( 'ioError', ehandler );
			this.stream.openAsync( this.o, w );
		}
	};
	A.file.prototype.read = function ( cb, fa ) {
		cb = A.type( cb ) == 'function' ? cb : function(){};
		fa = A.type( fa ) == 'function' ? fa : function(){};
		var that = this,
			handler = function(){
				that.unbind( 'complete', handler );
				var bytes = new A.bytes( that.get().data ); 
				cb.apply( that, [ bytes.read( ), bytes, event ] );
			};
		this.bind( 'complete', handler );
		this.get().load();
		return this;
	};
	A.file.prototype.write = function (content, cb, fa, askUser ) {
		cb = A.type( cb ) == 'function' ? cb : function(){};
		fa = A.type( fa ) == 'function' ? fa : function(){}
		var that = this,
			handler = function ( ) {
				that.unbind( 'complete', handler );
				cb.apply( that, arguments );
			};
		this.bind( 'complete', handler );
		if( askUser == true ) {
			this.get().save(content, this.name());
		} else {
			this.stream.open( this.o, window.runtime.flash.filesystem.FileMode.WRITE );
			this.stream.writeBytes( content );
			this.stream.close();
			handler();
		}
	};
	A.file.prototype.save = function (content, cb, fa ) {
		this.write( content, cb, fa, true )
	};
	A.file.icon = function ( ) {
		var bmps = this.get().icon.bitmaps;
	}
} )( jQuery.air, jQuery );