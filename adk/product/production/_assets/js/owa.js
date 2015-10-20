var owa_baseUrl = 'https://owa.vistacore.us/';
var owa_cmds = owa_cmds || [];
owa_cmds.push(['setSiteId', 'f6eca28945621473f2cbd850e859ab74']);
owa_cmds.push(['trackPageView']);
owa_cmds.push(['trackDomStream']);
// this capability is going to be made available in a future sprint
//owa_cmds.push(['trackClicks']);

(function() {
	var _owa = document.createElement('script'); 
	_owa.type = 'text/javascript'; 
	_owa.async = true;
	owa_baseUrl = ('https:' == document.location.protocol ? window.owa_baseSecUrl || owa_baseUrl.replace(/http:/, 'https:') : owa_baseUrl );
	_owa.src = owa_baseUrl + 'modules/base/js/owa.tracker-combined-min.js';
	var _owa_s = document.getElementsByTagName('script')[0]; 
	_owa_s.parentNode.insertBefore(_owa, _owa_s);
}());