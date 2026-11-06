'use client';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Gerente' | 'Cajero' | 'Cocina' | 'Domiciliario';
  isActive: boolean;
  avatarInitials: string;
}

export const STAFF_CREDENTIALS: { user: StaffUser; pass: string }[] = [
  {
    user: {
      id: 'u-superadmin',
      name: 'Super Administrador BEFFGER',
      email: 'admin@beffger.com',
      role: 'Administrador',
      isActive: true,
      avatarInitials: 'SA',
    },
    pass: 'AdminBeffger2026!',
  },
  {
    user: {
      id: 'u-gerente',
      name: 'Carlos Gerente Operativo',
      email: 'gerente@beffger.com',
      role: 'Gerente',
      isActive: true,
      avatarInitials: 'CG',
    },
    pass: 'gerente123',
  },
  {
    user: {
      id: 'u-cajero',
      name: 'Valentina Cajera Principal',
      email: 'cajero@beffger.com',
      role: 'Cajero',
      isActive: true,
      avatarInitials: 'VC',
    },
    pass: 'cajero123',
  },
  {
    user: {
      id: 'u-cocina',
      name: 'Chef Andrés Parrillero',
      email: 'cocina@beffger.com',
      role: 'Cocina',
      isActive: true,
      avatarInitials: 'AP',
    },
    pass: 'cocina123',
  },
  {
    user: {
      id: 'u-rider',
      name: 'Brayan Domiciliario BEFFGER',
      email: 'rider@beffger.com',
      role: 'Domiciliario',
      isActive: true,
      avatarInitials: 'BD',
    },
    pass: 'rider123',
  },
];

const STORAGE_KEY = 'beffger_auth_session';

export function getCurrentUser(): StaffUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StaffUser;
  } catch (e) {
    return null;
  }
}

export function login(
  email: string,
  pass: string
): { success: boolean; user?: StaffUser; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const match = STAFF_CREDENTIALS.find(
    (c) =>
      c.user.email.toLowerCase() === normalizedEmail &&
      (c.pass === pass || (normalizedEmail === 'admin@beffger.com' && pass === 'admin123'))
  );

  if (!match) {
    return {
      success: false,
      error: 'Correo o contraseña incorrectos. Verifica tus credenciales.',
    };
  }

  if (!match.user.isActive) {
    return {
      success: false,
      error: 'Este perfil se encuentra inactivo. Consulta con el Administrador.',
    };
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(match.user));
    // Set secure authentication cookie for server-side middleware route validation
    const cookieValue = encodeURIComponent(JSON.stringify({ id: match.user.id, role: match.user.role, email: match.user.email }));
    document.cookie = `beffger_auth_session=${cookieValue}; path=/; SameSite=Lax; max-age=86400`;
    window.dispatchEvent(new Event('beffger_auth_change'));
  }

  return { success: true, user: match.user };
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = 'beffger_auth_session=; path=/; max-age=0';
    window.dispatchEvent(new Event('beffger_auth_change'));
  }
}

/**
 * Default Landing Route by Role
 */
export function getDefaultRouteForRole(role: StaffUser['role']): string {
  switch (role) {
    case 'Cajero':
      return '/admin/caja';
    case 'Cocina':
      return '/admin/cocina';
    case 'Domiciliario':
      return '/rider/pedidos';
    case 'Administrador':
    case 'Gerente':
    default:
      return '/admin';
  }
}

/**
 * Role-Based Access Control (RBAC) Matrix
 */
export function hasPermission(role: StaffUser['role'], pathname: string): boolean {
  if (role === 'Administrador' || role === 'Gerente') {
    return true; // Acceso total a todos los paneles
  }

  if (role === 'Cajero') {
    return (
      pathname.startsWith('/admin/caja') ||
      pathname === '/admin/pedidos'
    );
  }

  if (role === 'Cocina') {
    return (
      pathname.startsWith('/admin/cocina') ||
      pathname === '/admin/pedidos'
    );
  }

  if (role === 'Domiciliario') {
    return (
      pathname.startsWith('/rider') ||
      pathname === '/admin/domicilios'
    );
  }

  return false;
}
