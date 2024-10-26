# eslint-plugin-member-safe

Prevent the risk that the type error of `Cannot read properties of undefined` when object accessed or function called.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-member-safe`:

```sh
npm install eslint-plugin-member-safe --save-dev
```

## Usage

Add `member-safe` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "member-safe"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "member-safe/optional-chaining-check": "error"
    }
}
```

## Rules

<!-- begin auto-generated rules list -->
🔧 Automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                 | Description                                                                                | 🔧  |
| :------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- | :-- |
| [optional-chaining-check](docs/rules/optional-chaining-check.md)                         | Check if the object accessed or function called using optional chaining operator.     | ✅  |
