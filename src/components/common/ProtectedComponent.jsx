import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const ProtectedComponent = ({ 
  children, 
  permission, 
  permissions, 
  requireAll = false,
  fallback = null,
  role 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, user } = usePermissions();

  // Role-based protection
  if (role && user?.role !== role) {
    return fallback;
  }

  // Single permission check
  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  // Multiple permissions check
  if (permissions) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      return fallback;
    }
  }

  return children;
};

export default ProtectedComponent;