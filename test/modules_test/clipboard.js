;jQuery.air.clipboard.testSuite = function( el ) {
	//jQuery.air.log( 'something from testsuite ' );
	el.html( 'loading some clipboard settings.' );
	var clipboard = new jQuery.air.clipboard();
	el.empty();
	jQuery.each( jQuery.air.clipboard.formats, function ( k, v ) {
		var d = clipboard.data( k );
		if( typeof d == "array" )
			d = d.join( "\n" );
		//jQuery.air.log( k, d );
		var t = $( '<div class="'+k+'"><label>'+k+'</label><input name="'+k+'" type="text" value="'+d+'"/><button>save</button></div>' );
		t.find( 'button' ).click( function ( ) {
			jQuery.air.log( k, ' is saving' );
			try {
				clipboard.data( k, t.find( 'input' ).attr( 'value' ) );
			} catch( e ) {
				jQuery.air.log( e, 'error by saving clipboard from ' + k + " with value " + t.find( 'input' ).attr( 'value' ) );
			}
			jQuery.air.log( k, 'fetch content from clipboard' );
			t.find( 'input' ).attr( 'value', clipboard.data( k ) )
		} );
		jQuery.air.log( {j:t} );
		el.append( t );
	} );
};