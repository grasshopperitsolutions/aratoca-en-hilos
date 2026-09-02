import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FolderOpen, Inbox, Leaf, LogOut, ShieldCheck, Users } from 'lucide-react';
import { signOut } from 'firebase/auth';

import Login from '../pages/admin/Login';
import { requireAuth } from '../firebaseAdmin';
import { useAdminAuth } from '../hooks/useAdminAuth';

const ADMIN_LINKS = [
  { to: '/admin/artesanos', label: 'Artesanos', icon: Users },
  { to: '/admin/mensajes', label: 'Mensajes', icon: Inbox },
  { to: '/admin/archivos', label: 'Archivos', icon: FolderOpen },
  { to: '/admin/administradores', label: 'Administradores', icon: ShieldCheck },
];

/**
 * Keeps the admin panel out of every index for as long as it is mounted.
 * The panel is never prerendered, so this runtime tag is the only robots
 * signal a crawler that reached /admin would ever see.
 */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

/**
 * Admin shell. Intentionally reachable only by typing the URL — it is absent
 * from the header, the footer and the sitemap.
 *
 * The UI is Spanish-only: it is an internal tool for the client, not part of
 * the bilingual public site.
 */
export default function AdminLayout() {
  const { status, user } = useAdminAuth();
  const navigate = useNavigate();
  useNoIndex();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-stone uppercase tracking-widest text-sm">Cargando…</p>
      </div>
    );
  }

  if (status !== 'admin') {
    return <Login status={status} />;
  }

  async function handleSignOut() {
    await signOut(requireAuth());
    navigate('/admin', { replace: true });
  }

  return (
    <div className="min-h-screen bg-cream text-charcoal font-nunito flex flex-col md:flex-row">
      <aside className="md:w-64 shrink-0 bg-charcoal text-cream md:min-h-screen p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <Leaf className="text-penca" size={22} />
          <span className="font-fraunces text-xl">
            Aratoca <span className="italic font-light text-terracotta">admin</span>
          </span>
        </div>

        <nav className="flex md:flex-col gap-2 flex-wrap">
          {ADMIN_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest transition-colors ${
                  isActive ? 'bg-penca text-cream' : 'text-cream/70 hover:bg-cream/10'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <p className="text-cream/50 text-xs mb-3 break-all">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-cream/70 hover:text-terracotta transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
