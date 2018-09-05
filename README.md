# shotgun

Shotgun is a DSL to query an object and call a function.

## Installation

```shell
npm install shotgun-query
```

## Usage:

```JavaScript
const expect = thing =>
	({ equals: otherThing => thing === otherThing });

new Shotgun(" res.status equals 200 ")
	.eval({ res: { status: 200 } })
	.call(expect);
```

## Convention

The function passed to `.call` must be of this signature:

```TypeScript
f = (arg : any) : object => ({
	g : (...rest : any[]) : any => { ... },
	...
});
```

It will be called as such:

```JavaScript
f(a)[g](...rest)
```

And the evaluation is returned.

## Tests

```shell
npm test
```
