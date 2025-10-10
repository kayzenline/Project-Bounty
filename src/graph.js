/**
 * generateFunctionGraph.js
 * 分析所有函数定义与调用关系，输出 .dot 可视化文件
 * by Nikki + GPT
 */
const fs = require('fs');
const path = require('path');

// ✅ 自动识别 src 目录
const dir = path.resolve(__dirname);

// 递归读取所有 .ts 文件
function getAllFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dirPath, e.name);
    if (e.isDirectory()) files.push(...getAllFiles(full));
    else if (e.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

// 匹配函数定义和调用
function extractFunctionsAndCalls(code) {
  // 匹配函数定义
  const defPattern = /(export\s+)?(function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*\(|let\s+([a-zA-Z0-9_]+)\s*=\s*\()/g;
  const defs = new Set();
  let m;
  while ((m = defPattern.exec(code))) {
    defs.add(m[3] || m[4] || m[5]);
  }

  // 匹配函数调用
  const calls = [];
  defs.forEach(f => {
    const regex = new RegExp(`\\b${f}\\s*\\(`, 'g');
    const matches = code.match(regex);
    if (matches) {
      matches.forEach(() => {
        calls.push(f);
      });
    }
  });

  return { defs: [...defs], calls };
}

// 构建函数依赖图
const files = getAllFiles(dir);
let graph = 'digraph FunctionDeps {\n  rankdir=LR;\n  node [shape=box, style=rounded, fillcolor=lightyellow];\n';

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  const { defs, calls } = extractFunctionsAndCalls(code);

  defs.forEach(f => {
    if (calls.includes(f)) return; // 避免自环
    calls.forEach(c => {
      graph += `  "${f}" -> "${c}";\n`;
    });
  });
}

graph += '}\n';
fs.writeFileSync('function_graph.dot', graph);
console.log('✅ 函数依赖图已生成：function_graph.dot');
console.log('➡️ 运行以下命令导出图片：');
console.log('   dot -Tpng function_graph.dot -o function_graph.png');
