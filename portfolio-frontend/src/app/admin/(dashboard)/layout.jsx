"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, User, Info, FolderOpen, Code2, Briefcase, Trophy, Mail, Inbox, Settings, LogOut, ExternalLink, Menu, X, GraduationCap } from 'lucide-react';

const NavItem = ({ href, children, icon: Icon, onClick }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
        >
            <Icon size={18} />
            <span className="font-medium text-sm">{children}</span>
        </Link>
    );
};

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (!token) {
            router.replace('/admin/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    const getPageTitle = () => {
        const path = pathname.split('/').pop();
        if (!path || path === 'admin') return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    };

    if (!mounted) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors custom-scrollbar">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative inset-y-0 left-0 w-72 bg-background/50 backdrop-blur-md border-r border-border p-6 flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="mb-10 px-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent tracking-tight">Admin OS</h2>
                        <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">v2.1 Stable</p>
                    </div>
                    <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-grow flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-2">
                    <NavItem href="/admin" icon={LayoutDashboard} onClick={() => setIsSidebarOpen(false)}>Dashboard</NavItem>
                    
                    <div className="mt-6 mb-2 px-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40">Core Content</div>
                    <NavItem href="/admin/profile" icon={User} onClick={() => setIsSidebarOpen(false)}>Header Profile</NavItem>
                    <NavItem href="/admin/about" icon={Info} onClick={() => setIsSidebarOpen(false)}>About Info</NavItem>
                    <NavItem href="/admin/projects" icon={FolderOpen} onClick={() => setIsSidebarOpen(false)}>Project Grid</NavItem>
                    <NavItem href="/admin/skills" icon={Code2} onClick={() => setIsSidebarOpen(false)}>Tech Stack</NavItem>
                    <NavItem href="/admin/experience" icon={Briefcase} onClick={() => setIsSidebarOpen(false)}>Work History</NavItem>
                    <NavItem href="/admin/achievements" icon={GraduationCap} onClick={() => setIsSidebarOpen(false)}>Achievements & Edu</NavItem>
                    
                    <div className="mt-6 mb-2 px-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40">Reach</div>
                    <NavItem href="/admin/contacts" icon={Mail} onClick={() => setIsSidebarOpen(false)}>Connect Links</NavItem>
                    <NavItem href="/admin/inbox" icon={Inbox} onClick={() => setIsSidebarOpen(false)}>Inquiries</NavItem>
                    
                    <div className="mt-6 mb-2 px-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40">Toolbox</div>
                    <NavItem href="/admin/settings" icon={Settings} onClick={() => setIsSidebarOpen(false)}>Global Config</NavItem>
                </nav>

                <div className="mt-auto pt-6 border-t border-border/50">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200">
                        <LogOut size={18} />
                        <span className="font-bold text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Section */}
            <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
                {/* Fixed Topbar */}
                <header className="h-20 border-b border-border bg-background/30 backdrop-blur-md flex items-center justify-between px-6 md:px-10 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{getPageTitle()}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">System Online</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/" 
                            target="_blank"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all"
                        >
                            <ExternalLink size={16} />
                            Preview Site
                        </Link>
                    </div>
                </header>

                {/* Sub-page Content */}
                <main className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-10 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.03),transparent_40%)]">
                    <div className="max-w-6xl mx-auto animate-in">
                        {children}
                        {/* Spacer to ensure last-row dropdowns are always scrollable into view */}
                        <div className="h-48 w-full shrink-0" aria-hidden="true" />
                    </div>
                </main>
            </div>
        </div>
    );
}
