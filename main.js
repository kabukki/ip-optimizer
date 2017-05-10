'use strict';

/* DOM vars */
var tbody = document.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0]
	, form = document.forms[0]
	, error = document.getElementById('error');

form.onsubmit = function() {
	var network = form['network'].value
		, netmask = form['netmask'].value
		, subnets = form['subnets'].value.split(',').filter(Number).map(Number);

	if (network.match(/^[0-9]{1,3}(\.[0-9]{1,3}){3}$/g) == null) {
		err("Invalid network IP.");
	} else if (isNaN(netmask) || netmask < 0 || netmask > 32) {
		err("Invalid mask.");
	} else if (subnets.length == 0) {
		err("Syntax error in subnetworks");
	} else {
		clear();
	}
	new Network(network.split('.').map(Number), parseInt(netmask)).split(subnets);
	return false;
};

function displayNetworks(networks) {
	while (tbody.firstChild)
		tbody.removeChild(tbody.firstChild);
	for (var i = 0; i < networks.length; i++) {
		var net = networks[i];
		var row = myCreateElement("tr");
		row.appendChild(myCreateElement("td", {innerHTML: i}));
		row.appendChild(myCreateElement("td", {innerHTML: net.address.join('.')}));
		row.appendChild(myCreateElement("td", {innerHTML: (256 - Math.pow(2, net.bits)) + ' (CIDR: /' + net.mask + ')'}));
		row.appendChild(myCreateElement("td", {innerHTML: '.' + (net.address[3] + 1) + ' -> .' + (net.address[3] + net.nbHosts - 2)}));
		row.appendChild(myCreateElement("td", {innerHTML: net.broadcast.join('.')}));
		tbody.appendChild(row);
	}
}

/* Helper */
/*
 * Decimal to binary
 */
function d2b(n) {
	return parseInt(n, 10).toString(2);
}

/*
 * Notifies the user of an error,
 *  both on the gui & in the console.
 */
function err(msg) {
	error.innerHTML = msg;
	console.log(msg);
}

/*
 * Notifies the user of an error,
 *  both on the gui & in the console.
 */
function clear() {
	error.innerHTML = '';
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