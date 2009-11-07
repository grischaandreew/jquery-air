/**
 * jQuery AIR Extension Library v0.0.1
 * http://code.google.com/p/jquery-air/
 *
 * Copyright (c) 2009 Grischa Andreew
 * Dual licensed under the MIT and GPL licenses.
 * 
 * file: security.js
 * created: 22.03.2009
 * modified: 16.04.2009
 *
 */

;( function ( A, j ) {
	A.security = function (  ) {
		
	};
	
	A.security.exact = function( p ){
		if( p !== undefined )
			window.runtime.flash.system.Security.exactSettings = (p == true ? true : false);
		else
			return window.runtime.flash.system.Security.exactSettings;
	};
	
	A.security.type = window.runtime.flash.system.Security.sandboxType;

	A.security.REMOTE = window.runtime.flash.system.Security.REMOTE;
	A.security.LOCAL_WITH_FILE = window.runtime.flash.system.Security.LOCAL_WITH_FILE;
	A.security.LOCAL_WITH_NETWORK = window.runtime.flash.system.Security.LOCAL_WITH_NETWORK;
	A.security.LOCAL_TRUSTED = window.runtime.flash.system.Security.LOCAL_TRUSTED;
	A.security.APPLICATION = window.runtime.flash.system.Security.APPLICATION;
	A.security.CAN_PDF = ( window.runtime.flash.html.HTMLLoader.pdfCapability == window.runtime.flash.html.HTMLPDFCapability.STATUS_OK ) ? true : false;
	
} ) ( jQuery.air, jQuery );