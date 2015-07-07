if (typeof btoa === "undefined") {
	_keyStr = Base64._keyStr;
	btoa = Base64.encode;
	atob = Base64.decode;
}