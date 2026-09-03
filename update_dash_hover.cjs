const fs = require('fs');
const path = require('path');
const dashPath = path.join(process.cwd(), 'src', 'pages', 'Dashboard.jsx');
let content = fs.readFileSync(dashPath, 'utf8');

content = content.replace(/className="bg-white rounded-2xl border border-gray-200\/80 p-5 shadow-sm"/g, 'className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-default hover:-translate-y-1"');

fs.writeFileSync(dashPath, content, 'utf8');
