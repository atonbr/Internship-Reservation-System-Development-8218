import { useAuth } from '../context/AuthContext';
import { hasPermission, hasAnyPermission, hasAllPermissions, getUserPermissions } from '../utils/rolePermissions';

export const usePermissions = () => {
  const { user } = useAuth();

  return {
    hasPermission: (permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(user, permissions),
    getUserPermissions: () => getUserPermissions(user),
    user
  };
};