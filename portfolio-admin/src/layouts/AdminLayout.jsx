import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const token = localStorage.getItem('adminToken');
    const navigate = useNavigate();

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="flex min-h-screen bg-surface-dark">
            {/* sidebar */}
            <aside>... your existing sidebar ...</aside>
            <main className="flex-grow p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;