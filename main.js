'use strict';

/* DOM vars */
var tbody = document.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];

/*
 * Returns the closest power of 2 that
 *  is greater or equal to n.
 * This equates the number of bits required
 *  to map n hosts.
 */
function getRequiredBits(n) {
	var p = 0;

	while (Math.pow(2, p) < n)
		p++;
	return p;
}

/*
 * Split available bits into subnetworks with 
 *  their capacity passed as parameter.
 * Returns the addresses of these networks.
 */
function split(network, subnets) {
	var addr = 0;

	subnets.sort(function(a, b) { return b-a; });
	network.diagnose();
	for (var i = 0; i < subnets.length; i++) {
		var bits = getRequiredBits(subnets[i] + 2);
		var net = new Network([network.address[0], network.address[1], network.address[2], addr], 32 - bits);

		console.log('--- Subnetwork #' + i + ' ---');
		console.log('Bits required for ' + subnets[i] + ' hosts + 2 addresses: ' + bits + 
			' ('+ (subnets[i]+2) + ' used/' + Math.pow(2, bits) + ' available)');
		console.log('Netmask is             : ' + (256 - Math.pow(2, bits)) + ' (CIDR: /' + net.mask + ') (' + d2b(256 - Math.pow(2, bits)) + ')');
		console.log('Network address is     : ' + net.address.join('.'));
		console.log('Host addresses are     : .' + (addr + 1) + ' -> .' + (addr + Math.pow(2, bits) - 2));
		console.log('Network broadcast is   : ' + net.broadcast.join('.'));
		addr += Math.pow(2, bits);
	}
}

function displayNetworks(networks) {
	while (tbody.firstChild)
		tbody.removeChild(tbody.firstChild);
	var row = myCreateElement("tr");
	for (var i = 0; i < networks.length; i++) {
		row.appendChild(myCreateElement("td", {innerHTML: i}));
		row.appendChild(myCreateElement("td", {innerHTML: ''}));
		row.appendChild(myCreateElement("td", {innerHTML: ''}));
		row.appendChild(myCreateElement("td", {innerHTML: ''}));
		row.appendChild(myCreateElement("td", {innerHTML: ''}));
	}
	tbody.appendChild(row);
}

/* Helper */
/*
 * Decimal to binary
 */
function d2b(n) {
	return parseInt(n, 10).toString(2);
}

/*
 * Creates a DOM element with the given attributes
 */
function myCreateElement(tag, attr) {
	var e = document.createElement(tag);

	for (var key in attr) {
		if (!attr.hasOwnProperty(key)) continue;
		e[key] = attr[key];
	}
	return e;
}