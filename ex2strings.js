const fs = require('fs');

function readFromFile(filePath) {
    return fs.readFileSync(filePath, { encoding: 'utf8' });
}

function createDateObject(string) {
	let dateParts = string.split('/');

	return new Date([dateParts[1], dateParts[0], dateParts[2]]);
}

function formatDate(date) {
	let dateParts = date.toDateString().split(' ');

	return [dateParts[2], dateParts[1], dateParts[3]].join(' ');
}

function expandOrTruncate(stringToFormat, desiredLength, padLeft=false) {
	if (stringToFormat.length == desiredLength) {
		return stringToFormat
	} else if (stringToFormat.length < desiredLength) {
		if (padLeft)
			return ' '.repeat(desiredLength - stringToFormat.length) + stringToFormat
		else
			return stringToFormat + ' '.repeat(desiredLength - stringToFormat.length)
	} else {
		truncationSymbol = ' ...'
		return stringToFormat.slice(0, desiredLength - truncationSymbol.length) + truncationSymbol
	}
}

function wrapInTableFormatting(strings) {
	return '| ' + strings.join(' | ') + ' |\n'
}

function displayAsTable(headers, body, widthLimits=[], padSettings=[]) {

	for (let index in headers) {
		if (!widthLimits[index]) {
			let maxWidth = Math.max(...body.map((entry) => {return entry[index].length}));
			widthLimits[index] = Math.max(maxWidth, headers[index].length);
		}
		padSettings[index] = !!padSettings[index]
	}

	let headersFixedLength = [];

	for (let index in headers) {
		headersFixedLength.push(expandOrTruncate(headers[index], widthLimits[index], padSettings[index]))
	}

	let result = wrapInTableFormatting(headersFixedLength)

	let totalWidth = widthLimits.reduce((accumulator, current) => accumulator + current);
	totalWidth += (widthLimits.length - 1) * 3  + 2
	result += '|' + '='.repeat(totalWidth) + '|\n'
	
	for (let rowIndex in body) {
		let currentRow = []
		for (let cellIndex in body[rowIndex])
			currentRow.push(expandOrTruncate(body[rowIndex][cellIndex], widthLimits[cellIndex], padSettings[cellIndex]))

		result += wrapInTableFormatting(currentRow)
	}

	return result
}

function writeToFile(filePath, text) {
	fs.writeFileSync(filePath, text);
}

let csvText = readFromFile('dataEx2strings.csv');

let lines = csvText.split('\r\n');

let headersText = lines[0];
let bodyText = lines.slice(1, -1);

let bodyCells = []

for(let line of bodyText) {
	let cells = line.split(',');

	cells[0] = formatDate(createDateObject(cells[0]));

	bodyCells.push(cells)
}

writeToFile('result.txt', displayAsTable(headersText.split(','), bodyCells, [null, 29, 21], [false, true, false]))

