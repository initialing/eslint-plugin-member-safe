/**
 * @fileoverview Check if the object accessed or function called using optional chaining operator
 * @author Scholes Zheng
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Check if object property references add optional chaining",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: "object",
        properties: {
            exceptFunction: { type: "boolean" }
        },
        additionalProperties: false
    }
    ], // Add a schema if the rule has options
    messages: {
      optionalChainingCheck: "Add optional chaining to this property reference or function call",
    },
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    const scopeParent = context.sourceCode ? context.sourceCode : context;
    let globals = [...(context.settings ? context.settings.globals || [] : [])];
    const individualCheckNodeTypes = ["Program", "BlockStatement", "ExpressionStatement", "ReturnStatement", "IfStatement"]
    
    const option = context.options[0] || {};
    const exceptFunction = !!option.exceptFunction;
    function rootIdentifierIsGlobal(node) {
      if (node.type === "Identifier") {
        return globals.includes(node.name);
      } else if ((node.type === "CallExpression" || node.type === "NewExpression") && node.callee) {
        return rootIdentifierIsGlobal(node.callee);
      }
      return rootIdentifierIsGlobal(node.object);
    }

    function isAssignmentLeft(node) {
      if (node.parent && node.parent.type === "AssignmentExpression") {
        return node.range[0] === node.parent.left.range[0] && node.range[1] === node.parent.left.range[1];
      } else if (node.parent && individualCheckNodeTypes.includes(node.parent.type)) {
        return false;
      }
      return isAssignmentLeft(node.parent);
    }

    function isTaggedTemplate(node) {
      if (node.parent && node.parent.type === "TaggedTemplateExpression") {
        return true;
      } else if (node.parent && individualCheckNodeTypes.includes(node.parent.type)) {
        return false;
      }
      return isTaggedTemplate(node.parent);
    }

    function isNewExpression(node) {
      if (node.parent && node.parent.type === "NewExpression") {
        return true;
      } else if (node.parent && individualCheckNodeTypes.includes(node.parent.type)) {
        return false;
      }
      return isNewExpression(node.parent);
    }

    return {
      // visitor functions for different types of nodes
      Program(node) {
        globals = [...globals, ...scopeParent.getScope(node).variables.map(v => v.name)];
      },
      MemberExpression(node) {
        if (node.optional || 
          rootIdentifierIsGlobal(node) || 
          isAssignmentLeft(node) || 
          isTaggedTemplate(node) ||
          isNewExpression(node)
        ) return;
        context.report({
          node,
          messageId: "optionalChainingCheck",
          fix(fixer) {
            if (node.property.type === "Literal") {
              return fixer.insertTextAfter(node.object, "?.");
            }
            return fixer.insertTextAfter(node.object, "?");
          },
        });
      },
      CallExpression(node) {
        if (exceptFunction && node.callee.type === "Identifier") return;
        if (node.optional || 
          rootIdentifierIsGlobal(node) || 
          isAssignmentLeft(node) || 
          isTaggedTemplate(node) ||
          isNewExpression(node)
        ) return;
        context.report({
          node,
          messageId: "optionalChainingCheck",
          fix(fixer) {
            return fixer.insertTextAfter(node.callee, "?.");
          },
        });
      }
    };
  },
};
