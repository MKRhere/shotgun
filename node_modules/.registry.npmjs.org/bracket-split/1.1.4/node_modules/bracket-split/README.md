# bracket-split

This module can do bracket-aware splitting of strings!

## Example:

```js
const bracketSplit = require('bracket-split');

bracketSplit(
	' ',
	'{ "status": "ok" } [ "status" ] 2 3')
//-> [ '{ "status": "ok" }', '[ "status" ]', '2', '3' ]
```

## Options

```js
bracketSplit(
	delimiter,
	str,
	brackets = [ [ '{', '}' ], [ '[', ']' ] ],
	quotes = [ '\'', '"' ],
	escaper = '\\'
)
```

`delimiter` and `str` work as if you did `str.split(delimiter)`

`brackets` are pairs of brackets to treat specially, these will be checked for maching pairs in the `str` you are splitting, and errors may be thrown!

`quotes` are quote characters, brackets will be ignored if they are quoted (treated as plain strings)

`escaper` is a string to prefix another character in order to always treat it as a normal character (you can escape quotes and brackets to ignore them)

## Possible errors

```bash
Unexpected closing bracket: <closing bracket>
Unexpected end of input, expected: <quote or closing bracket>
```
