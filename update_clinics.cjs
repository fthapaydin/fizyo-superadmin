const fs = require('fs');
const path = require('path');
const clinicsPath = path.join(process.cwd(), 'src', 'pages', 'Clinics.jsx');
let content = fs.readFileSync(clinicsPath, 'utf8');

// Add useToast
content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { useToast } from '../components/ui/Toast';");

// Use toast instead of alert
content = content.replace(/export default function Clinics\(\{[^}]+\}\) \{/g, `$&
  const { toast } = useToast();`);

content = content.replace(/alert\(([^)]+)\)/g, 'toast.error($1)');
content = content.replace(/toast\.error\('Klinik başarıyla eklendi!'\)/g, "toast.success('Klinik başarıyla eklendi!')");
content = content.replace(/toast\.error\('Klinik güncellendi!'\)/g, "toast.success('Klinik güncellendi!')");
content = content.replace(/toast\.error\('Klinik silindi!'\)/g, "toast.success('Klinik silindi!')");

// Replace confirm
content = content.replace(/if \(!window\.confirm\('Bu kliniği silmek istediğinize emin misiniz\?'\)\) return;/g, 
  "if (!window.confirm('Bu kliniği silmek istediğinize emin misiniz?')) return;");

fs.writeFileSync(clinicsPath, content, 'utf8');

const annPath = path.join(process.cwd(), 'src', 'pages', 'Announcements.jsx');
let annContent = fs.readFileSync(annPath, 'utf8');
annContent = annContent.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useToast } from '../components/ui/Toast';");
annContent = annContent.replace(/export default function Announcements\(\) \{/g, `$&
  const { toast } = useToast();`);
annContent = annContent.replace(/alert\(([^)]+)\)/g, 'toast.success($1)');
fs.writeFileSync(annPath, annContent, 'utf8');
