'use strict';

class Network {
	constructor(address, mask) {
		this._address = address;
		this._mask = mask;
	}

	/* Getters */
	get address() {
		return this._address;
	}
	get mask() {
		return this._mask;
	}
	/* Available bits */
	get bits() {
		return 32 - this._mask;
	}
	get broadcast() {
		// Broadcast = address | ~mask
		var im = (~(Math.pow(2, 32) - this.nbHosts)).toString(2).padStart(32, '0').match(/.{8}/g).map(function(x) { return parseInt(x, 2); });
		return this._address.map(function(byte, n) { return byte | im[n]; });
	}
	get nbHosts() {
		return Math.pow(2, this.bits);
	}

	/* Setters */
	set address(address) {
		this._address = address;
	}
	set mask(mask) {
		this._mask = mask;
	}

	/*
	 * Returns the closest power of 2 that
	 *  is greater or equal to n.
	 * This equates the number of bits required
	 *  to map n hosts.
	 */
	static getRequiredBits(n) {
		var p = 0;

		while (Math.pow(2, p) < n)
			p++;
		return p;
	}

	diagnose() {
		console.log('Bits used for subnet   : ' + this._mask);
		console.log('Bits left for hosts    : ' + this.bits);
		console.log('Number of addresses    : ' + this.nbHosts);
	}

	/*
	 * Split available bits into subnetworks with 
	 *  their capacity passed as parameter.
	 * Displays these networks on the GUI table.
	 */
	split(subnets) {
		var addr = 0,
			nets = [];

		this.diagnose();
		subnets.sort(function(a, b) { return b-a; });
		for (var i = 0; i < subnets.length; i++) {
			var bits = Network.getRequiredBits(subnets[i] + 2);
			var net = new Network([this.address[0], this.address[1], this.address[2], addr], 32 - bits);

			console.log('--- Subnetwork #' + i + ' ---');
			console.log('Bits required for ' + subnets[i] + ' hosts + 2 addresses: ' + bits + 
				' ('+ (subnets[i]+2) + ' used/' + Math.pow(2, bits) + ' available)');
			console.log('Netmask is             : ' + (256 - Math.pow(2, bits)) + ' (CIDR: /' + net.mask + ') (' + d2b(256 - Math.pow(2, bits)) + ')');
			console.log('Network address is     : ' + net.address.join('.'));
			console.log('Host addresses are     : .' + (addr + 1) + ' -> .' + (addr + Math.pow(2, bits) - 2));
			console.log('Network broadcast is   : ' + net.broadcast.join('.'));
			nets.push(net);
			addr += Math.pow(2, bits);
		}
		displayNetworks(nets);
	}
}

/* Mask notation */
Network.BINARY = 0;
Network.DECIMAL = 1;
Network.CIDR = 2;
