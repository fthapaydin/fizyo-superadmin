const fs = require('fs');
const path = require('path');
const dashPath = path.join(process.cwd(), 'src', 'pages', 'Dashboard.jsx');
let content = fs.readFileSync(dashPath, 'utf8');
content = content.replace(/c\.status === 'aktif' \? \(/g, "c.status === 'aktif' ? (\n").replace(/<span className="w-1.5 h-1.5 rounded-full bg-red-500" \/> Pasif\n\s*<\/span>\n\s*\)}/g, 
`c.status === 'deneme' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Deneme
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Pasif
                        </span>
                      )}`);
fs.writeFileSync(dashPath, content, 'utf8');
