# Check if the object accessed or function called using optional chaining operator (`optional-chaining-check`)

Avoid the risk when the object accessed or function called throw the type error of `Cannot read properties of undefined`.

## Rule Details

This rule will auto add optional chaining operator (`?.`) to the object accessed or function called, but to the global variables, this rule will not check.

#### Valid

```js
obj?.bar;
foo?.();
obj?.[bar];
console.log(obj?.foo);
```

#### Invalid

```js
obj.bar;
foo();
obj[bar];
```

### Options

##### `exceptFunction`

You can pass an `{ exceptFunction: true }` as an option to this rule to avoid checking function calls. Default is `false`.

```js
foo();
```

### Cautions

This rule conflicts with a eslint built-in rule([no-unsafe-optional-chaining](https://eslint.org/docs/latest/rules/no-unsafe-optional-chaining)). If you use this rule, you should turn off the built-in rule.