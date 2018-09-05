'use strict';

// Utils
const isEmpty = list =>
	list.length === 0;

const head = list =>
	list[0];

const init = list =>
	list.slice(0, -1);

const last = list =>
	list[list.length - 1];

const assoc = (key, value, obj) =>
	({ ...obj, [key]: value });

const merge = (a, b) =>
	({ ...a, ...b });

const append = (list, item) =>
	[ ...list, item ];

const concatLast = (list, str) =>
	append(
		init(list),
		(last(list) || '') + str);

// Bracket-related functions
const isOpening = (char, brackets) =>
	brackets.some(x =>
		head(x) === char);

const isClosing = (char, brackets) =>
	brackets.some(x =>
		last(x) === char);

const openingToClosing = (char, brackets) =>
	last(brackets.find(x =>
		head(x) === char) || []);

// Main
const Splitter = (delimiter, brackets, quotes, escaper) =>
	(state, char) => {
		const { acc, escape, quoted, stack } = state;
		if (escape) {
			return merge(state, {
				acc: concatLast(acc, char),
				escape: false
			});
		}
		if (char === escaper) {
			return merge(state, {
				acc: concatLast(acc, char),
				escape: true
			});
		}
		if (!quoted && quotes.includes(char)) {
			return merge(state, {
				acc: concatLast(acc, char),
				quoted: char
			});
		}
		if (quoted === char) {
			return merge(state, {
				acc: concatLast(acc, char),
				quoted: false
			});
		}
		if (quoted) {
			return assoc('acc', concatLast(acc, char), state);
		}
		if (isOpening(char, brackets)) {
			return merge(state, {
				acc: concatLast(acc, char),
				stack: append(stack, char)
			});
		}
		if (isClosing(char, brackets)) {
			if (
				isEmpty(stack) ||
				char !== openingToClosing(last(stack), brackets)
			) {
				throw new SyntaxError('Unexpected closing bracket: ' + char);
			}
			return merge(state, {
				acc: concatLast(acc, char),
				stack: init(stack)
			});
		}
		if (char === delimiter && isEmpty(stack)) {
			return assoc('acc', append(acc, ''), state);
		}
		return assoc('acc', concatLast(acc, char), state);
	};

/**
 * Performs a bracket-aware string split.
 * @param {string} delimiter The delimiter to split by.
 * @param {string} str The string to split.
 * @param {Array<string[]>} [brackets] Override the default brackets: { } [ ].
 * @param {string[]} [quotes] Override the default string quotes: ' ".
 * @param {string} [escaper] Override the default escape character: \.
 * @returns {string[]} The splitted string.
 * @throws {SyntaxError} Will throw if the brackets don't match up.
 */
const bracketSplit = (
	delimiter,
	str,
	brackets = [ [ '{', '}' ], [ '[', ']' ] ],
	quotes = [ '\'', '"' ],
	escaper = '\\'
) => {
	const splitter = Splitter(delimiter, brackets, quotes, escaper);
	const result = str
		.split('')
		.reduce(splitter, {
			acc: [],
			escape: false,
			quoted: false,
			stack: []
		});
	if (result.quoted) {
		throw new SyntaxError(
			'Unexpected end of input, expected: ' +
			result.quoted);
	}
	if (!isEmpty(result.stack)) {
		throw new SyntaxError(
			'Unexpected end of input, expected: ' +
			openingToClosing(last(result.stack), brackets));
	}
	return result.acc;
};

module.exports = bracketSplit;
