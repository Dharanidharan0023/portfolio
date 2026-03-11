const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Project/myportfolio/portfolio-admin/src';
const destDir = 'd:/Project/myportfolio/portfolio-frontend-new/src';

const pages = [
    { file: 'AdminDashboard.jsx', route: 'admin' },
    { file: 'AdminLogin.jsx', route: 'admin/login' },
    { file: 'ManageProfile.jsx', route: 'admin/profile' },
    { file: 'ManageAbout.jsx', route: 'admin/about' },
    { file: 'ManageProjects.jsx', route: 'admin/projects' },
    { file: 'ManageSkills.jsx', route: 'admin/skills' },
    { file: 'ManageExperience.jsx', route: 'admin/experience' },
    { file: 'ManageEducation.jsx', route: 'admin/education' },
    { file: 'ManageAchievements.jsx', route: 'admin/achievements' },
    { file: 'ManageContacts.jsx', route: 'admin/contacts' },
    { file: 'ManageSettings.jsx', route: 'admin/settings' }
];

function transformContent(content) {
    // Add "use client" since these are React views with hooks
    let newContent = '"use client";\n\n' + content;

    // Replace react-router-dom imports
    newContent = newContent.replace(/import\s+{(.*?)}\s+from\s+['"]react-router-dom['"];/g, (match, imports) => {
        let nextImports = [];
        if (imports.includes('useNavigate')) {
            nextImports.push('useRouter');
            // Replace usage
        }
        if (imports.includes('useLocation')) {
            nextImports.push('usePathname');
        }
        if (imports.includes('Link')) {
            return `import Link from "next/link";\nimport { useRouter, usePathname } from "next/navigation";`;
        }
        return `import { useRouter, usePathname } from "next/navigation";`;
    });

    newContent = newContent.replace(/const\s+navigate\s*=\s*useNavigate\(\)/g, 'const router = useRouter()');
    newContent = newContent.replace(/navigate\(/g, 'router.push(');
    newContent = newContent.replace(/const\s+location\s*=\s*useLocation\(\)/g, 'const pathname = usePathname()');
    newContent = newContent.replace(/location\.pathname/g, 'pathname');

    // Fix internal paths since they moved.
    // In `portfolio-admin`, pages imported components via `../components/...`.
    // From `src/app/admin/page.jsx`, it's `../../components/admin/...`.
    // Let's use absolute path aliases if Next.js has them, or just relative based on depth.
    // Assuming Next.js config has `@/*` alias for `src/*`.
    newContent = newContent.replace(/from\s+['"]\.\.\/components\/(.*?)['"]/g, 'from "@/components/admin/$1"');
    newContent = newContent.replace(/from\s+['"]\.\.\/hooks\/(.*?)['"]/g, 'from "@/hooks/$1"');
    newContent = newContent.replace(/from\s+['"]\.\.\/utils\/(.*?)['"]/g, 'from "@/utils/$1"');
    newContent = newContent.replace(/from\s+['"]\.\.\/lib\/(.*?)['"]/g, 'from "@/lib/$1"');

    return newContent;
}

for (const { file, route } of pages) {
    const pageSrc = path.join(srcDir, 'pages', file);
    const pageDestDir = path.join(destDir, 'app', route);
    const pageDest = path.join(pageDestDir, 'page.jsx');

    if (fs.existsSync(pageSrc)) {
        fs.mkdirSync(pageDestDir, { recursive: true });
        const content = fs.readFileSync(pageSrc, 'utf8');
        fs.writeFileSync(pageDest, transformContent(content));
        console.log(`Copied ${file} to ${route}/page.jsx`);
    }
}
