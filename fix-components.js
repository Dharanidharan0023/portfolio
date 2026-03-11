const fs = require('fs');
const path = require('path');

const dirsToMigrate = [
    'd:/Project/myportfolio/portfolio-frontend-new/src/components/admin',
    'd:/Project/myportfolio/portfolio-frontend-new/src/hooks',
    'd:/Project/myportfolio/portfolio-frontend-new/src/admin-layouts'
];

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            walk(file, callback);
        } else {
            callback(file);
        }
    });
}

function fixComponent(file) {
    if (!file.endsWith('.js') && !file.endsWith('.jsx')) return;

    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (!content.includes('"use client"') && !content.includes("'use client'")) {
        content = '"use client";\n' + content;
        changed = true;
    }

    // Replace react-router-dom imports
    if (content.includes('react-router-dom')) {
        content = content.replace(/import\s+{(.*?)}\s+from\s+['"]react-router-dom['"];/g, (match, imports) => {
            let nextImports = [];
            let hasLink = imports.includes('Link');
            let hasOutlet = imports.includes('Outlet');

            let out = '';
            if (hasLink) out += `import Link from "next/link";\n`;
            if (hasOutlet) out += `// Note: Replace Outlet with children in Next.js layout\n`;

            // Navigation hooks
            if (imports.includes('useNavigate') || imports.includes('useLocation') || imports.includes('Navigate')) {
                out += `import { useRouter, usePathname, redirect } from "next/navigation";\n`;
            }
            return out;
        });

        content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\)/g, 'const router = useRouter()');
        content = content.replace(/navigate\(/g, 'router.push(');
        content = content.replace(/const\s+location\s*=\s*useLocation\(\)/g, 'const pathname = usePathname()');
        content = content.replace(/location\.pathname/g, 'pathname');
        content = content.replace(/<Navigate\s+to=(["{].*?["}])\s*replace\s*\/?>(.*?<\/Navigate>)?/s, (match, toValue) => {
            return `{/* Navigate ${toValue} handled in layout or effect */}`;
        });

        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
}

dirsToMigrate.forEach(dir => walk(dir, fixComponent));
