/**
 * @fileoverview Check if object property references add optional chaining
 * @author Scholes Zheng
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/optional-chaining-check"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  }
});
ruleTester.run("optional-chaining-check", rule, {
  valid: [
    // give me some code that won't trigger a warning
    'a?.b',
    'a?.b?.c',
    'a?.b?.c?.()',
    'a?.b?.()?.d',
    'a?.()',
    'a?.["b"]',
    'a?.["b"]?.()',
    'a.b = 1;',
    'a.b.c.d = 1;',
    'a.b().c.d = 1;',
    'let a = b?.c;',
    'a.d = b?.c;',
    'a.d.c`c`;',
    'a.d().c`c`;',
    'new a()',
    'new a.b()',
    '() => { return a?.b; }',
    'function a() {}',
    'a?.b?.(c,d);',
    `
    function parse(code, option) {
      return expree?.parse?.(code, option);
    }
      `,
    {
      code: 'module.exports',
      env: {
        node: true
      }
    },
    {
      code: "new Date().getDate()",
      env: {
        node: true
      }
    },
    {
      code: "a();",
      options: [{exceptFunction: true}],
    }
  ],

  invalid: [
    {
      code: "a.b;",
      errors: [{ message: "Add optional chaining to this property reference or function call"}],
      output: "a?.b;"
    },
    {
      code: "a['b'];",
      errors: [{ message: "Add optional chaining to this property reference or function call"}],
      output: "a?.['b'];"
    },
    {
      code: "a['b'] = c.d;",
      errors: [{ message: "Add optional chaining to this property reference or function call"}],
      output: "a['b'] = c?.d;"
    },
    {
      code: "a?.b();",
      errors: [{ message: "Add optional chaining to this property reference or function call"}],
      output: "a?.b?.();"
    },
    {
      code: "a?.b();",
      errors: [{ message: "Add optional chaining to this property reference or function call"}],
      options: [{exceptFunction: true}],
      output: "a?.b?.();"
    },
    {
      code: "a?.['b']();",
      errors: [{ message: "Add optional chaining to this property reference or function call"}],
      output: "a?.['b']?.();"
    },
    {
      code: "a.b?.();",
      errors: [{ message: "Add optional chaining to this property reference or function call"}],
      output: "a?.b?.();"
    },
    {
      code: "a?.b?.().c;",
      errors: [{ message: "Add optional chaining to this property reference or function call"}],
      output: "a?.b?.()?.c;"
    },
    {
      code: "a();",
      errors: [{ message: "Add optional chaining to this property reference or function call"}],
      output: "a?.();"
    },
    {
      code: "rcvQtyMap[line.orderNumber] = (rcvQtyMap[line.orderNumber] + line.transactionQty).hlFixed()",
      errors: [
        { message: "Add optional chaining to this property reference or function call"},
        { message: "Add optional chaining to this property reference or function call"},
        { message: "Add optional chaining to this property reference or function call"},
        { message: "Add optional chaining to this property reference or function call"},
        { message: "Add optional chaining to this property reference or function call"}
      ],
      output: "rcvQtyMap[line.orderNumber] = (rcvQtyMap?.[line?.orderNumber] + line?.transactionQty)?.hlFixed?.()"
    },
    {
      code: `
        function parse(code, option) {
          return expree.parse(code, option);
        }
      `,
      errors: [
        { message: "Add optional chaining to this property reference or function call"}, 
        { message: "Add optional chaining to this property reference or function call"}
      ],
      output: `
        function parse(code, option) {
          return expree?.parse?.(code, option);
        }
      `
    },
    {
      code: `
        if (a.b) {
          a.b.c();
        }
      `,
      errors: [
        { message: "Add optional chaining to this property reference or function call"}, 
        { message: "Add optional chaining to this property reference or function call"},
        { message: "Add optional chaining to this property reference or function call"},
        { message: "Add optional chaining to this property reference or function call"} 
      ],
      output: `
        if (a?.b) {
          a?.b?.c?.();
        }
      `
    },
  ],
});
