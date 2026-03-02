import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AnimatedCursor from './components/AnimatedCursor';

import ProtectedRoute from './components/ProtectedRoute';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const ManageProjects = lazy(() => import('./pages/ManageProjects'));
const ManageExperience = lazy(() => import('./pages/ManageExperience'));
const ManageEducation = lazy(() => import('./pages/ManageEducation'));
const ManageSkills = lazy(() => import('./pages/ManageSkills'));
const ManageAchievements = lazy(() => import('./pages/ManageAchievements'));
const ManageProfile = lazy(() => import('./pages/ManageProfile'));
const ManageAbout = lazy(() => import('./pages/ManageAbout'));
const ManageContacts = lazy(() => import('./pages/ManageContacts'));
const ManageSettings = lazy(() => import('./pages/ManageSettings'));

function App() {
  return (
    <BrowserRouter>
      <AnimatedCursor />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-primary">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/profile" element={<ManageProfile />} />
              <Route path="/about" element={<ManageAbout />} />
              <Route path="/projects" element={<ManageProjects />} />
              <Route path="/skills" element={<ManageSkills />} />
              <Route path="/experience" element={<ManageExperience />} />
              <Route path="/education" element={<ManageEducation />} />
              <Route path="/achievements" element={<ManageAchievements />} />
              <Route path="/contacts" element={<ManageContacts />} />
              <Route path="/settings" element={<ManageSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
