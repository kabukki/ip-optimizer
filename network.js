'use strict';

class Network {
	constructor(address, mask) {
		this._address = address;
		this._mask = mask;
	}

	diagnose() {
		var hbits = 32 - this._mask;

		console.log('Bits used for subnet   : ' + this._mask);
		console.log('Bits left for hosts    : ' + hbits);
		console.log('Number of addresses    : ' + this.nbHosts);
	}

	/* Getters */
	get address() {
		return this._address;
	}
	get mask() {
		return this._mask;
	}
	get broadcast() {
		// Broadcast = address | ~mask
		var im = (~(Math.pow(2, 32) - Math.pow(2, 32 - this._mask))).toString(2).padStart(32, '0').match(/.{8}/g).map(function(x) { return parseInt(x, 2); });
		return this._address.map(function(byte, n) { return byte | im[n]; });
	}
	get nbHosts() {
		return Math.pow(2, 32 - this._mask);
	}

	/* Setters */
	set address(address) {
		this._address = address;
	}
	set mask(mask) {
		this._mask = mask;
	}
}

/* Mask notation */
Network.BINARY = 0;
Network.DECIMAL = 1;
Network.CIDR = 2;
