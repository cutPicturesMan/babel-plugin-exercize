const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const template = require('@babel/template').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const fs = require("fs");
const path = require("path");

const code = fs.readFileSync(path.resolve(__dirname, './sourceCode.js'), {
    encoding: 'utf-8'
});
console.log(code);

const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"]
});

traverse(ast, {
    CallExpression (path) {
        const callee = path.get('callee');

        console.log(callee);
    }
})
