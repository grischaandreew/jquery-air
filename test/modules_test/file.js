;jQuery.air.file.testSuite = function( el ) {
	el.html( 'loading some file settings.' );
	var startFile = new jQuery.air.file( 'desktop');
	el.empty();
	function loadFiles ( f ) {
		el.html( 'loading files for directory ' + f.name() );
		f.files( function ( fs ) {
			el.empty();
			$.each( fs, function ( i, f ) {
				el.append( $( '<div>'+f.name() + (
						f.is("directory") == true ? ' :directory' : '')
					+ '</div>' ).click( function(){
						loadFiles( f );
				} ) );
			} );
		} )
	}
	el.html( startFile.name() ).click( function ( ) {
		loadFiles( startFile );
	} );
};