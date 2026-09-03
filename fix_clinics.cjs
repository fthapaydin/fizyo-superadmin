const fs = require('fs');
const path = require('path');
const clinicsPath = path.join(process.cwd(), 'src', 'pages', 'Clinics.jsx');
let content = fs.readFileSync(clinicsPath, 'utf8');

if (!content.includes('useToast')) {
    content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';\nimport { useToast } from '../components/ui/Toast';");
} else if (!content.includes('../components/ui/Toast')) {
    content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';\nimport { useToast } from '../components/ui/Toast';");
}
// check if useEffect is missing
if (!content.includes('useEffect(() => {')) {
    content = content.replace("const [showModal, setShowModal] = useState(initialAddOpen);", "const [showModal, setShowModal] = useState(initialAddOpen);\n  useEffect(() => {\n    if (initialAddOpen) setShowModal(true);\n  }, [initialAddOpen]);");
}
fs.writeFileSync(clinicsPath, content, 'utf8');
