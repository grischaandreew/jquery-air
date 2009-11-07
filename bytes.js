/*
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: bytes.js
 * created: 23.03.2009
 * modified: 23.03.2009
 *
 */

( function ( A, j ) {
	var types = [ "Boolean", "Byte", "Bytes", "Double", "Float", "Int", "Object", "Short", "UnsignedByte", "UnsignedShort", "UTF", "UTFBytes", "MultiByte" ];
	var algorithms = {
		zip: window.runtime.flash.utils.CompressionAlgorithm.ZLIB,
		deflate: window.runtime.flash.utils.CompressionAlgorithm.DEFLATE
	},
	endian = {
		big: window.runtime.flash.utils.Endian.BIG_ENDIAN,
		small: window.runtime.flash.utils.Endian.LITTLE_ENDIAN
	};
	
	A.bytes = function ( bytes ) {
		this.bytes = bytes || new window.runtime.flash.utils.ByteArray();
		this.algorithm_key = false;
	};
	A.bytes.prototype.get = function ( ) {
		return this.bytes;
	};
	A.bytes.prototype.type = function( type ){
		type = type || "UTFBytes";
		var rType = false;
		for( var i = 0; i < types.length; i++ )
			if( type.toLowerCase() == types[i].toLowerCase() ) {
				rType = types[i];
				break;
			}
		return rType || "UTFBytes";
	};
	A.bytes.prototype.write = function ( content, length, type, more ) {
		length = type == undefined ? 1 : length; 
		type = type == undefined ? this.type( length ) : this.type( type );
		if( type == "MultiByte" ) {
			length = A.type( length ) != 'string' ? window.runtime.flash.filesystem.File.systemCharset : length;
			this.bytes['write'+type]( content, length );
		}
		else if ( type == "Bytes" )
			this.bytes['write'+type]( content, more, length );
		else
			this.bytes['write'+type]( content );
		return this;
	};
	A.bytes.prototype.read = function ( length, type, content, more ) {
		var ntype = type == undefined ? this.type( length ) : this.type( type );
		var nlength = type == undefined || length == undefined ? this.available() : length; 
		if( ntype == "MultiByte" || ntype == "UTFBytes" )
			return this.bytes['read'+ntype]( nlength );
		else if ( ntype == "Bytes" )
			return this.bytes['write'+ntype]( content, more, nlength );
		else
			return this.bytes['read'+ntype]( );
	};
	A.bytes.prototype.endian = function( endia ){
		if( endia == undefined ) {
			return this.bytes.endian;
		} else {
			endia = endian[ endia.toLowerCase() ] ? endian[ endia.toLowerCase() ] : endian.small;
			this.bytes.endian = endia;
			return this;
		}
	};
	A.bytes.prototype.position = function ( i ){
		if( A.type( i ) == "number" ) {
			this.bytes.position = i;
			return this;
		} else {
			return this.bytes.position;
		}
	};
	A.bytes.prototype.available = function(){
		return this.bytes.bytesAvailable;
	};
	A.bytes.prototype.size = function(){
		return this.bytes.length;
	};
	A.bytes.prototype.compress = function ( alg ) {
		alg = this.algorithm( alg );
		this.bytes.compress( alg );
		return this;
	};
	A.bytes.prototype.uncompress = function( alg ) {
		alg = this.algorithm( alg );
		this.bytes.uncompress( alg );
		return this;
	};
	A.bytes.prototype.algorithm = function ( alg ) {
		if( alg == undefined ) {
			return this.algorithm_key; 
		} else {
			alg = ( algorithms[ alg.toLowerCase() ] != undefined ) ? algorithms[ alg.toLowerCase() ] : algorithms.zip;
			this.algorithm_key = alg;
			return this;
		}
	}
} ) ( jQuery.air, jQuery );