import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Only the owner (valid server session) may render dashboard routes. */
export default function RequireOwner() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="adm-boot" role="status" aria-live="polite">
        <span className="adm-boot-dot" aria-hidden="true" />
        Checking your session…
      </div>
    );
  }

  if (status !== 'owner') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
