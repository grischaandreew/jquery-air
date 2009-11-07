;jQuery.air.bitmap.testSuite = function( ground ) {
	ground.append( $('<div>make screenshot of app and scale 50%</div>').click(function(){
		screenshot();
	}) );
	ground.append( $('<div>make screenshot of app, scale 50% and rotate 1 </div>').click(function(){
		screenshot2();
	}) );
	ground.append( $('<div>make screenshot of app, scale 50% and translate 10,10 </div>').click(function(){
		screenshot3();
	}) );
	var bod = $("<div></div>").appendTo(ground);
	screenshot = function( e ) {
		var bmp = new $.air.bitmap( window.htmlLoader.width, window.htmlLoader.height ).draw( window.htmlLoader );
		var j = bmp.scale( 0.5 ).image();
		bod.empty().append( j );
	};
	screenshot2 = function( e ) {
		var bmp = new $.air.bitmap( window.htmlLoader.width, window.htmlLoader.height ).draw( window.htmlLoader );
		var j = bmp.scale( 0.5 ).rotate(1).image();
		bod.empty().append( j );
	};
	screenshot3 = function( e ) {
		var bmp = new $.air.bitmap( window.htmlLoader.width, window.htmlLoader.height ).draw( window.htmlLoader );
		var j = bmp.scale( 0.5 ).translate(10,10).image();
		bod.empty().append( j );
	};
};