import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

const INITIAL = {
  status: 'loading', // loading | owner | guest | offline
  authenticated: false,
  configured: true,
  email: null,
  expiresAt: null,
  sessionHours: null,
};

export function AuthProvider({ children }) {
  const [state, setState] = useState(INITIAL);

  const applyMe = useCallback((data) => {
    setState({
      status: data.authenticated ? 'owner' : 'guest',
      authenticated: Boolean(data.authenticated),
      configured: data.configured !== false,
      email: data.email ?? null,
      expiresAt: data.expiresAt ?? null,
      sessionHours: data.sessionHours ?? null,
    });
  }, []);

  const refresh = useCallback(async () => {
    try {
      applyMe(await api.me());
      return true;
    } catch (error) {
      setState((current) => ({
        ...current,
        status: 'offline',
        authenticated: false,
        email: null,
        expiresAt: null,
      }));
      return false;
    }
  }, [applyMe]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [refresh]);

  // Sign out locally the moment the server-side session expires.
  useEffect(() => {
    if (!state.expiresAt) return undefined;

    const remaining = state.expiresAt - Date.now();
    if (remaining <= 0) {
      setState((current) => ({
        ...current,
        status: 'guest',
        authenticated: false,
        email: null,
        expiresAt: null,
      }));
      return undefined;
    }

    const timer = setTimeout(
      () => {
        refresh();
      },
      Math.min(remaining + 1000, 2_147_483_647)
    );

    return () => clearTimeout(timer);
  }, [state.expiresAt, refresh]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await api.login(email, password);
      applyMe(data);
      return data;
    },
    [applyMe]
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      /* even if the API is unreachable, drop the local session view */
    }

    setState((current) => ({
      ...current,
      status: 'guest',
      authenticated: false,
      email: null,
      expiresAt: null,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: state.status === 'owner',
      offline: state.status === 'offline',
      session: state.expiresAt
        ? { email: state.email, expiresAt: state.expiresAt }
        : null,
      login,
      logout,
      refresh,
    }),
    [state, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
}
