const assert = require('assert');
const Shotgun = require('.');

const expect = thing =>
	({
		equals: otherThing => assert.equal(thing, otherThing),
		deepEquals: otherThing => assert.deepEqual(thing, otherThing),
	});

const testStrings = [
	" data.status equals 200 ",
	" data.thing equals 'value' ",
	" data.obj deepEquals { 'cool': 'shit' } ",
	" data.arr deepEquals [ 'awesome', { 'other': 'things' } ] ",
	" data.status equals otherData.0 "
];

const env = {
	data: {
		status: 200,
		thing: "value",
		obj: {
			cool: 'shit'
		},
		arr: [
			'awesome',
			{
				'other': 'things'
			}
		]
	},
	otherData: [
		200,
		true
	]
};

testStrings.forEach(
	x => {
		new Shotgun(x)
			.eval(env)
			.call(expect);
	}
);

console.log('All tests pass');
