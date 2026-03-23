"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NavItem = ({ href, children }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            className={`text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
        >
            {children}
        </Link>
    );
};

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.replace('/admin/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors overflow-x-hidden">
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border p-6 flex flex-col h-auto md:h-screen sticky top-0 bg-background z-20">
                <h2 className="text-2xl font-bold text-primary mb-10">Admin Panel</h2>
                <nav className="flex flex-col gap-4 flex-grow">
                    <NavItem href="/admin">Dashboard</NavItem>
                    <NavItem href="/admin/profile">Profile (Header)</NavItem>
                    <NavItem href="/admin/about">About Section</NavItem>
                    <NavItem href="/admin/projects">Projects</NavItem>
                    <NavItem href="/admin/skills">Skills</NavItem>
                    <NavItem href="/admin/experience">Experience</NavItem>
                    <NavItem href="/admin/education">Education</NavItem>
                    <NavItem href="/admin/achievements">Achievements</NavItem>
                    <NavItem href="/admin/contacts">Contact Info</NavItem>
                    <NavItem href="/admin/inbox">Messages (Inbox)</NavItem>
                    <NavItem href="/admin/settings">Site Settings</NavItem>
                </nav>
                <button onClick={handleLogout} className="mt-auto px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">Logout</button>
            </aside>

            <main className="flex-grow p-6 md:p-10 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}
