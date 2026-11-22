import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import RequireOwner from './RequireOwner';
import AdminLogin from './pages/AdminLogin';
import Overview from './pages/Overview';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import SkillsPage from './pages/SkillsPage';
import SocialsPage from './pages/SocialsPage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import ProcessPage from './pages/ProcessPage';
import TestimonialsPage from './pages/TestimonialsPage';
import WritingPage from './pages/WritingPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import '../styles/admin.css';

/**
 * Mounted by App at any /admin/* path, so these routes use absolute paths.
 */
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<RequireOwner />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Overview />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
          <Route path="/admin/about" element={<AboutPage />} />
          <Route path="/admin/skills" element={<SkillsPage />} />
          <Route path="/admin/socials" element={<SocialsPage />} />
          <Route path="/admin/projects" element={<ProjectsPage />} />
          <Route path="/admin/services" element={<ServicesPage />} />
          <Route path="/admin/process" element={<ProcessPage />} />
          <Route path="/admin/testimonials" element={<TestimonialsPage />} />
          <Route path="/admin/writing" element={<WritingPage />} />
          <Route path="/admin/messages" element={<MessagesPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
