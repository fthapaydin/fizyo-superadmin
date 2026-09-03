const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') {
        walk(dirPath, callback);
      }
    } else {
      if (['.jsx', '.js', '.html', '.css', '.json'].includes(path.extname(f))) {
        callback(dirPath);
      }
    }
  });
}

// 1. Global rebrand
walk(baseDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content.replace(/Fizyotim/g, 'Fizyotim');
  newContent = newContent.replace(/admin@fizyopanel\.com/g, 'admin@fizyotim.com');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }
});
