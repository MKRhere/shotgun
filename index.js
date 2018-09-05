'use strict';

const bracketedSplit = require('bracket-split');

const path = obj => path =>
	path.reduce((result, segment) => result && result[segment], obj);

class Shotgun {

	constructor (str) {

		this.parts = bracketedSplit(' ', str.trim().replace(/'/g, '"'))
			.map((x, i) => {

				let response;

				try {
					const parsed = JSON.parse(x);
					const type = parsed === null ? 'nil' : typeof parsed;
					response = [ type, parsed ];
				} catch {
					const type = typeof x;
					if (i === 1)
						response = [ 'function', x ];
					else if (x === 'undefined')
						response = [ 'nil', undefined ];
					else if (x === 'null')
						response = [ 'nil', null ];
					else if (type === 'string')
						response = [ 'pathSelector', x ];
					else
						console.log('wat', x);
				}

				return response;

			});

	}

	eval (env = {}) {

		const parts = this.parts.map(
			part => {
				if (part[0] === 'pathSelector') {
					const selector = part[1].split('.');
					return path(env[selector.shift()])(selector);
				} else {
					return part[1];
				}
			}
		);

		this.evaled = parts;
		return this;

	}

	call (fn) {
		const [ callable, next, ...rest ] = this.evaled;
		return fn(callable)[next](...rest);
	}

}

module.exports = Shotgun;
