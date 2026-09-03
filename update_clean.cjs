const fs = require('fs');
const path = require('path');

const clinicsPath = path.join(process.cwd(), 'src', 'pages', 'Clinics.jsx');
let clinicsContent = fs.readFileSync(clinicsPath, 'utf8');
clinicsContent = clinicsContent.replace(/KeyRound, ShieldAlert, Phone, Mail, /g, '');
clinicsContent = clinicsContent.replace(/KeyRound, /g, '');
clinicsContent = clinicsContent.replace(/ShieldAlert, /g, '');
clinicsContent = clinicsContent.replace(/Phone, /g, '');
clinicsContent = clinicsContent.replace(/Mail, /g, '');

// Also fix initialAddOpen issue: use useEffect to watch for prop changes
if (!clinicsContent.includes('useEffect(() => { if (initialAddOpen) setIsAddOpen(true); }, [initialAddOpen]);')) {
    clinicsContent = clinicsContent.replace(/const \[isAddOpen, setIsAddOpen\] = useState\(initialAddOpen \|\| false\);/, 
        "const [isAddOpen, setIsAddOpen] = useState(initialAddOpen || false);\n  useEffect(() => {\n    if (initialAddOpen) setIsAddOpen(true);\n  }, [initialAddOpen]);");
}
fs.writeFileSync(clinicsPath, clinicsContent, 'utf8');

const annPath = path.join(process.cwd(), 'src', 'pages', 'Announcements.jsx');
let annContent = fs.readFileSync(annPath, 'utf8');
annContent = annContent.replace(/ToggleLeft, ToggleRight, Radio, /g, '');
annContent = annContent.replace(/ToggleLeft, /g, '');
annContent = annContent.replace(/ToggleRight, /g, '');
annContent = annContent.replace(/Radio, /g, '');
fs.writeFileSync(annPath, annContent, 'utf8');

const modalPath = path.join(process.cwd(), 'src', 'components', 'QRCodeModal.jsx');
if (fs.existsSync(modalPath)) {
    let modalContent = fs.readFileSync(modalPath, 'utf8');
    modalContent = modalContent.replace(/FizyoPanel ile/g, 'Fizyotim ile');
    fs.writeFileSync(modalPath, modalContent, 'utf8');
}
