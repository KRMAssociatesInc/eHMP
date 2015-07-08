'use strict';

/*
Variadic Function:
Delay(initMillis, maxMillis, incMillis)
Delay(config)

config should have one or more of the following
properties: initMillis, maxMillis, incMillis
*/
function Delay(initMillis, maxMillis, incMillis) {
	if(!(this instanceof Delay)) {
		if(arguments.length === 1) {
			return new Delay(arguments[0]);
		} else {
			return new Delay(initMillis, maxMillis, incMillis);
		}
	}

	if(arguments.length === 1) {
		var config = arguments[0];
		return new Delay(config.initMillis, config.maxMillis, config.incMillis);
	}

	this.initialMillis = initMillis || 1000;
	this.maximumMillis = maxMillis || 1000;
	this.incrementMillis = incMillis || 0;

	this.currentMillis = this.initialMillis;
}

Delay.prototype.increment = function() {
	if (this.currentMillis < this.maximumMillis) {
		this.currentMillis += this.incrementMillis;
		if (this.currentMillis > this.maximumMillis) {
			this.currentMillis = this.maximumMillis;
		}
	}
};

Delay.prototype.reset = function() {
	this.currentMillis = this.initialMillis;
};

module.exports = Delay;
