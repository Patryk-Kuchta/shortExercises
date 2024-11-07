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

function expandOrTruncate(stringToFormat, desiredLength, pad_left=false) {
	if (stringToFormat.length == desiredLength) {
		return stringToFormat
	} else if (stringToFormat.length < desiredLength) {
		if (pad_left)
			return ' '.repeat(desiredLength - stringToFormat.length) + stringToFormat
		else
			return stringToFormat + ' '.repeat(desiredLength - stringToFormat.length)
	} else {
		return stringToFormat.slice(0, desiredLength - 4) + ' ...'
	}
}

function wrapInTableFormatting(strings) {
	return '| ' + strings.join(' | ') + ' |\n'
}

function displayAsTable(headers, body, width_lims=[null, 29, 21], pad_setting=[false, true, false]) {

	// calculate the width of 
	for (let index in width_lims) {
		if (!width_lims[index]) {
			let max_width = Math.max(...body.map((entry) => {return entry[index].length}));
			width_lims[index] = Math.max(max_width, headers[index].length);
		}
	}

	let headers_fixed_length = [];

	for (let index in headers) {
		headers_fixed_length.push(expandOrTruncate(headers[index], width_lims[index], pad_setting[index]))
	}

	// header line
	let result = wrapInTableFormatting(headers_fixed_length)

	// separator
	let total_width = width_lims.reduce((accumulator, current) => accumulator + current);
	total_width += (width_lims.length - 1) * 3  + 2
	result += '|' + '='.repeat(total_width) + '|\n'

	// body lines	
	for (let row_index in body) {
		let current_row = []
		for (let cell_index in body[row_index])
			current_row.push(expandOrTruncate(body[row_index][cell_index], width_lims[cell_index], pad_setting[cell_index]))

		result += wrapInTableFormatting(current_row)
	}

	return result
}

function writeToFile(filePath, text) {
	fs.writeFileSync(filePath, text);
}

let csv_text = readFromFile('dataEx2strings.csv');

let lines = csv_text.split('\r\n');

let headers_text = lines[0];
let body_text = lines.slice(1, -1);

let body_cells = []

for(let line of body_text) {
	let cells = line.split(',');

	cells[0] = formatDate(createDateObject(cells[0]));

	body_cells.push(cells)
}

writeToFile('result.txt', displayAsTable(headers_text.split(','), body_cells))

