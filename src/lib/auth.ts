'use client';

import { StaffRole, StaffUser } from '@/lib/types';
import { sha256, signSession } from '@/lib/security';

export type { StaffRole, StaffUser };

export interface StaffCredential {
  user: StaffUser;
  passHash: string;
}

export const DEFAULT_SUPERADMIN_CREDENTIAL: StaffCredential = {
  user: {
    id: 'u-superadmin',
    name: 'Super Administrador BEFFGER',
    email: 'admin@beffger.com',
    role: 'Administrador',
    phone: '+57 300 000 0000',
    isActive: true,
    avatarInitials: 'SA',
    createdAt: new Date().toISOString(),
    lastLogin: 'En línea',
  },
  passHash: '314854f4b7a40ba57183307db920897cd68c002c54792727f5e456e8d165ae6e', // SHA-256('AdminBeffger2026!')
};

const CREDENTIALS_STORAGE_KEY = 'beffger_staff_credentials';
const SESSION_STORAGE_KEY = 'beffger_auth_session';

/**
 * Retrieve all configured staff credentials from local storage.
 * Defaults strictly to Super Administrador only (no demo employees).
 * Automatically migrates legacy plaintext passwords to SHA-256 hashes.
 */
export function getStaffCredentials(): StaffCredential[] {
  if (typeof window === 'undefined') {
    return [DEFAULT_SUPERADMIN_CREDENTIAL];
  }

  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        CREDENTIALS_STORAGE_KEY,
        JSON.stringify([DEFAULT_SUPERADMIN_CREDENTIAL])
      );
      return [DEFAULT_SUPERADMIN_CREDENTIAL];
    }

    const parsed: any[] = JSON.parse(raw);

    // Auto-purge legacy demo employees if present (Carlos, Valentina, Chef Andrés, Brayan)
    const sanitized = parsed
      .filter(
        (item) =>
          item.user &&
          !item.user.name.includes('Carlos Gerente') &&
          !item.user.name.includes('Valentina Cajera') &&
          !item.user.name.includes('Chef Andrés') &&
          !item.user.name.includes('Brayan Domiciliario')
      )
      .map((item) => {
        // Upgrade legacy plaintext passwords to SHA-256 hash
        const passHash = item.passHash || (item.pass ? sha256(item.pass) : DEFAULT_SUPERADMIN_CREDENTIAL.passHash);
        return {
          user: item.user,
          passHash,
        };
      });

    if (!sanitized.some((item) => item.user.email.toLowerCase() === 'admin@beffger.com')) {
      sanitized.unshift(DEFAULT_SUPERADMIN_CREDENTIAL);
    }

    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized.length > 0 ? sanitized : [DEFAULT_SUPERADMIN_CREDENTIAL];
  } catch (e) {
    return [DEFAULT_SUPERADMIN_CREDENTIAL];
  }
}

/**
 * Retrieve list of staff users
 */
export function getStaffUsers(): StaffUser[] {
  return getStaffCredentials().map((c) => c.user);
}

/**
 * Helper to compute avatar initials
 */
function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Dynamically create a new collaborator user with a specific role and password
 */
export function createStaffUser(params: {
  name: string;
  email: string;
  role: StaffRole;
  pass: string;
  phone?: string;
}): { success: boolean; user?: StaffUser; error?: string } {
  const cleanName = params.name.trim();
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanPass = params.pass.trim();

  if (!cleanName || cleanName.length < 3) {
    return { success: false, error: 'Ingresa un nombre válido de al menos 3 caracteres.' };
  }

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: 'Ingresa un correo electrónico institucional válido.' };
  }

  if (!cleanPass || cleanPass.length < 6) {
    return { success: false, error: 'La contraseña debe contener al menos 6 caracteres.' };
  }

  const existing = getStaffCredentials();
  if (existing.some((c) => c.user.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: `Ya existe un usuario registrado con el correo ${cleanEmail}.` };
  }

  const newUser: StaffUser = {
    id: `u-${Date.now().toString(36)}`,
    name: cleanName,
    email: cleanEmail,
    role: params.role,
    phone: params.phone?.trim() || '',
    isActive: true,
    avatarInitials: computeInitials(cleanName),
    createdAt: new Date().toISOString(),
    lastLogin: 'Nunca',
  };

  const passHash = sha256(cleanPass);
  const updated = [...existing, { user: newUser, passHash }];
  if (typeof window !== 'undefined') {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('beffger_staff_change'));
  }

  return { success: true, user: newUser };
}

/**
 * Toggle active/inactive status for a staff user
 */
export function toggleStaffUserStatus(id: string): { success: boolean; error?: string } {
  const existing = getStaffCredentials();
  const target = existing.find((c) => c.user.id === id);

  if (!target) {
    return { success: false, error: 'Usuario no encontrado.' };
  }

  if (target.user.email.toLowerCase() === 'admin@beffger.com') {
    return { success: false, error: 'No es posible desactivar al Super Administrador principal.' };
  }

  const updated = existing.map((c) => {
    if (c.user.id === id) {
      return { ...c, user: { ...c.user, isActive: !c.user.isActive } };
    }
    return c;
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('beffger_staff_change'));
  }

  return { success: true };
}

/**
 * Delete a staff user (blocked for superadmin)
 */
export function deleteStaffUser(id: string): { success: boolean; error?: string } {
  const existing = getStaffCredentials();
  const target = existing.find((c) => c.user.id === id);

  if (!target) {
    return { success: false, error: 'Usuario no encontrado.' };
  }

  if (target.user.email.toLowerCase() === 'admin@beffger.com' || target.user.id === 'u-superadmin') {
    return { success: false, error: 'El Super Administrador principal no puede ser eliminado.' };
  }

  const updated = existing.filter((c) => c.user.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('beffger_staff_change'));
  }

  return { success: true };
}

/**
 * Get active session
 */
export function getCurrentUser(): StaffUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StaffUser;
  } catch (e) {
    return null;
  }
}

/**
 * Authenticate staff user
 */
export function login(
  email: string,
  pass: string
): { success: boolean; user?: StaffUser; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const credentials = getStaffCredentials();
  const hashedInput = sha256(pass.trim());

  const match = credentials.find(
    (c) =>
      c.user.email.toLowerCase() === normalizedEmail &&
      (c.passHash === hashedInput || (c as any).pass === pass)
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

  // Update last login
  match.user.lastLogin = 'En línea';
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(match.user));
    // Set cryptographically signed session token cookie for server-side middleware route validation
    const signedSessionToken = signSession({
      id: match.user.id,
      role: match.user.role,
      email: match.user.email,
    });
    document.cookie = `beffger_auth_session=${encodeURIComponent(
      signedSessionToken
    )}; path=/; SameSite=Lax; max-age=86400`;
    window.dispatchEvent(new Event('beffger_auth_change'));
  }

  return { success: true, user: match.user };
}

/**
 * Sign out current staff session
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    document.cookie = 'beffger_auth_session=; path=/; max-age=0';
    window.dispatchEvent(new Event('beffger_auth_change'));
  }
}

/**
 * Default Landing Route by Role
 */
export function getDefaultRouteForRole(role: StaffRole): string {
  switch (role) {
    case 'Cajero':
      return '/admin/caja';
    case 'Cocina':
      return '/admin/cocina';
    case 'Domiciliario':
      return '/admin/domicilios';
    case 'Mesero':
      return '/admin/pedidos';
    case 'Administrador':
    case 'Gerente':
    default:
      return '/admin';
  }
}

/**
 * Role-Based Access Control (RBAC) Matrix
 */
export function hasPermission(role: StaffRole, pathname: string): boolean {
  if (role === 'Administrador' || role === 'Gerente') {
    return true; // Acceso total a todos los módulos
  }

  if (role === 'Cajero') {
    return pathname.startsWith('/admin/caja') || pathname === '/admin/pedidos';
  }

  if (role === 'Cocina') {
    return pathname.startsWith('/admin/cocina') || pathname === '/admin/pedidos';
  }

  if (role === 'Domiciliario') {
    return pathname.startsWith('/rider') || pathname === '/admin/domicilios';
  }

  if (role === 'Mesero') {
    return pathname === '/admin/pedidos' || pathname.startsWith('/admin/caja');
  }

  return false;
}
