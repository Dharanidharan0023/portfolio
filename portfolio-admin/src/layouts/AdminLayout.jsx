import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const token = localStorage.getItem('adminToken');
    const navigate = useNavigate();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-surface-dark">
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-primary mb-10">Admin Panel</h2>
                <nav className="flex flex-col gap-4 flex-grow">
                    <NavLink to="/" end className={({ isActive }) => `text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}>
                        Profile (Header)
                    </NavLink>
                    <NavLink to="/about" className={({ isActive }) => `text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}>
                        About Section
                    </NavLink>
                    <NavLink to="/projects" className={({ isActive }) => `text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}>
                        Projects
                    </NavLink>
                    <NavLink to="/skills" className={({ isActive }) => `text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}>
                        Skills
                    </NavLink>
                    <NavLink to="/experience" className={({ isActive }) => `text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}>
                        Experience
                    </NavLink>
                    <NavLink to="/achievements" className={({ isActive }) => `text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}>
                        Achievements
                    </NavLink>
                    <NavLink to="/contacts" className={({ isActive }) => `text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}>
                        Contact Info
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `text-left px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}>
                        Site Settings
                    </NavLink>
                </nav>
                <button onClick={handleLogout} className="mt-auto px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">Logout</button>
            </aside>

            <main className="flex-grow p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
