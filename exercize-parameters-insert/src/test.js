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

const consoleName = ["log", "info", "debug", "error"].map(item => `console.${item}`);

const ast = parser.parse(code, {
    sourceType: "unambiguous",
    plugins: ["jsx"]
});

traverse(ast, {
    CallExpression (path) {
        if (path.node.isNew) {
            return;
        }

        const callee = path.get('callee');
        const calleeName = callee.toString();

        if (consoleName.includes(calleeName)) {
            let newNode = template.expression(`console.log("${__filename}", ${path.node.start}, ${path.node.end})`)();
            newNode.isNew = true;

            if (path.findParent((path) => path.isJSXElement())) {
                path.replaceWith(t.arrayExpression([newNode, path.node]))
                path.skip();
            } else {
                path.insertBefore(newNode)
            }
        }
    }
})

console.log(generate(ast).code);
