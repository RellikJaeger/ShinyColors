const babel = require('@rollup/plugin-babel')
const json = require('@rollup/plugin-json')
const resolve = require('@rollup/plugin-node-resolve')
const cmjs = require('@rollup/plugin-commonjs')
const { terser } = require('rollup-plugin-terser')
const { version } = require('../package.json')

const banner = `// ==UserScript==
// @name         偶像大师ShinyColors汉化
// @namespace    https://github.com/biuuu/ShinyColors
// @version      ${version}
// @description  提交翻译或问题请到 https://github.com/biuuu/ShinyColors
// @icon         https://shinycolors.enza.fun/icon_192x192.png
// @author       biuuu
// @match        https://shinycolors.enza.fun/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      api.interpreter.caiyunai.com
// @connect      translate.google.cn
// @connect      fanyi.baidu.com
// @updateURL    https://www.shiny.fun/ShinyColors.user.js
// @supportURL   https://github.com/biuuu/ShinyColors/issues
// ==/UserScript==`
module.exports = {
  input: 'src/main.js',
  plugins: [
    resolve({ preferBuiltins: false }),
    cmjs({ ignore: ['stream'], include: /node_modules/ }),
    json(),
    babel({
      exclude: 'node_modules/**',
      plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-proposal-nullish-coalescing-operator'],
      presets: [['@babel/preset-env', {
        modules: false,
        targets: 'last 3 iOS versions'
      }]]
    }),
    terser({
      output: {
        comments: function (node, comment) {
          var text = comment.value;
          var type = comment.type;
          if (type == "comment1") {
            // multiline comment
            return /^\s@|\s==\/?UserScript==/i.test(text);
          }
        }
      }
    })
  ],
  output: {
    file: './dist/ShinyColors.user.js',
    format: 'iife',
    name: 'shinycolors_zh',
    banner: banner,
    intro: `const ENVIRONMENT = "${process.env.BUILD === 'development' ? 'development' : ''}";
    const DEV = ${process.env.DEV ? true : false};
    const SHOW_UPDATE_TEXT = ${process.env.TEXT ? true : false};
    const COLLECT_CARD_RATE = ${process.env.CARD ? true : false};
    const RES_NAME = '';`
  }
};
