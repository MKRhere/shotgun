'use strict';

const assert = require('assert');

const bracketSplit = require('.');

const input = '{ "status": "ok" } [ "status" ] 2 3';
const output = [ '{ "status": "ok" }', '[ "status" ]', '2', '3' ];

assert.deepStrictEqual(bracketSplit(' ', input), output);

console.log(input);
console.log(output.map(x =>
	JSON.parse(x)));


const quoteInput = '[ "}" ]';
const quoteOutput = [ '[ "}" ]' ];

assert.deepStrictEqual(bracketSplit(' ', quoteInput), quoteOutput);

console.log(quoteInput);
console.log(quoteOutput.map(x =>
	JSON.parse(x)));


const escapeInput = '[ \\} ]';
const escapeOutput = [ '[ \\} ]' ];

assert.deepStrictEqual(bracketSplit(' ', escapeInput), escapeOutput);

console.log(escapeInput);
console.log(escapeOutput);

const lispInput = '(reduce add 0 (list 1 2 3))';
const lispOutput = [ 'reduce', 'add', '0', [ 'list', '1', '2', '3' ] ];

const unwrap = str =>
	str.slice(1, -1);

const parseLisp = str =>
	bracketSplit(' ', str, [ [ '(', ')' ] ], [], '');

const iterate = x =>
	x.startsWith('(') && x.endsWith(')')
		? parseLisp(unwrap(x)).map(iterate)
		: x;

assert.deepStrictEqual(iterate(lispInput), lispOutput);

console.log(lispInput);
console.log(lispOutput);


const mkrInput = '{ "status": { "help" : ok" } }';
const mkrOutput = new SyntaxError('Unexpected end of input, expected: "');

assert.throws(() => bracketSplit(' ', mkrInput));

console.log(mkrInput);
console.error(mkrOutput.name + ': ' + mkrOutput.message);
