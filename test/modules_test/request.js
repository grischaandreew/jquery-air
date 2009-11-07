//http://jquery-air.googlecode.com/svn/trunk/
;jQuery.air.request.testSuite = function( ground ) {
	var that = this;
	var fi = $("<div class='filesystem'>filesystem</div>").appendTo(ground.empty());
	var content = $("<div class='content'></div>").appendTo(ground);
	
	content.html( 'loading some file settings.' );
	
	this.base = "http://jquery-air.googlecode.com/svn/trunk/";
	this.filesystem = {};
	
	this.inProgress = function(status, loaded, total, event, url) {
		content.html(status + '% from url ' + url );
	};
	this.writeFilesystem = function ( ) {
		fi.empty();
		$.each(that.filesystem, function( i, f ) {
			fi.append(  $('<div class="'+f.type+'">'+f.name+'</div>').click(function ( ) {
				var e = $(this);
				if( f.type == "file" ) {
					that.getFile( f.url, function( html ) {
						content.html( "<pre><code class='javascript'>"+html+"</code></pre>" );
						window.setTimeout( function(){
							dp.sh.HighlightAll( 'javascript',false,false,false,true,false );
						}, 1 );
					} );
				} else {
					that.getDirectory( f.url, function ( files,directories ) {
						$.each(files, function (i,file ){
							f.files[file] = {'url': that.base + file, "name": file, "type": 'file'};
						});
						$.each(directories, function (i,file ){
							f.files[file] = {'url': that.base + file, "name": file, "type": 'directory','files':[]};
						});
						var ul = $("<ul></ul>");
						$.each( f.files, function ( i, file ) {
							ul.append( $( '<li class="'+file.type+'">'+file.name+'</li>' ).click(function(){
								var ee = $(this);
								if( file.type == "file" ) {
									that.getFile( file.url, function( html ) {
										content.html( "<pre><code class='javascript'>"+html+"</code></pre>" );
										window.setTimeout( function(){
											dp.sh.HighlightAll( 'javascript',false,false,false,true,false );
										}, 1 );
									} );
								} else {
									that.getDirectory( file.url, function ( files,directories ) {
										$.each(files, function (i,file ){
											f.files[file] = {'url': that.base + file, "name": file, "type": 'file'};
										});
										$.each(directories, function (i,file ){
											f.files[file] = {'url': that.base + file, "name": file, "type": 'directory','files':[]};
										});
										var ul = $("<ul></ul>");
										$.each( f.files, function ( i, file ) {
											ul.append( $( '<li class="'+file.type+'">'+file.name+'</li>' ).click(function(){
												var ee = $(this);
												
											}) );
										} );
										ee.after(ul);
									} );
								}
							}) );
						} );
						e.after(ul);
					} );
				}
			} ) );
		} );
	}
	
	this.getDirectory = function ( url,cb, er ) {
		url = url || "";
		cb = cb || function(){};
		er = er || function(){};
		url = url.replace( that.base, "" );
		new jQuery.air.request( that.base + url ).bind('air.exception', function ( ) {
			content.html( 'cant fetch content from url ' + this.options.url );
		} ).bind( "air.progress", function(status, loaded, total, event){
			that.inProgress(status, loaded, total, event,that.base + url);
		} ).bind("air.success", function(html, event){
			var files = [];
			var directories = [];
			var as = $(html).find('li > a');
			$.each(as, function ( i, a ) {
				var h = $(a).attr('href');
				if( h == "./" || h == "../" ) return;
				else if( h[h.length-1] == "/" ) directories.push(h);
				else files.push(h);
			} );
			cb(files,directories,url);
		} ).load();
	};
	
	this.getFile = function ( url, cb, er ) {
		cb = cb || function(){};
		er = er || function(){};
		url = url.replace( that.base, "" );
		new jQuery.air.request( that.base + url ).bind('air.exception', function ( ) {
			content.html( 'cant fetch content from url ' + this.options.url );
		} ).bind( "air.progress", function(status, loaded, total, event){
			that.inProgress(status, loaded, total, event,that.base + url);
		} ).bind("air.success", function(html, event){
			cb(html,url,url);
		} ).load();
	};
	this.getDirectory("",function ( files, directories ) {
		$.each(files, function (i,file ){
			that.filesystem[file] = {'url': that.base + file, "name": file, "type": 'file'};
		});
		$.each(directories, function (i,file ){
			that.filesystem[file] = {'url': that.base + file, "name": file, "type": 'directory','files':{}};
		});
		that.writeFilesystem();
	} );
};