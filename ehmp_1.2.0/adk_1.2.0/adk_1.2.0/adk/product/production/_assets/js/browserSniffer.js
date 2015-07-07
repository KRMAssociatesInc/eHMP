(function(){

	// make it safe to use console.log always
	(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
	{console.log();return window.console;}catch(err){return window.console={};}})());

	var baseUrl = document.getElementById("app-loader").src.indexOf('container');
        baseUrl = baseUrl >= 0 ? 'container/' : '';

	if ((!Modernizr.audio && navigator.userAgent.indexOf('PhantomJS')) < 0 || navigator.userAgent.indexOf('Android 2.2') > 0) {
		alert('Your browser does not support this application. Please upgrade your browser or device.\n\n');
		window.location = baseUrl + 'newbrowser.html';
	}
}());