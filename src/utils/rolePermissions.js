// Role-based permissions system
export const ROLES = {
  STUDENT: 'student',
  INSTITUTION: 'institution',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

export const PERMISSIONS = {
  // Student permissions
  VIEW_INTERNSHIPS: 'view_internships',
  CREATE_RESERVATIONS: 'create_reservations',
  CANCEL_RESERVATIONS: 'cancel_reservations',
  VIEW_OWN_RESERVATIONS: 'view_own_reservations',
  
  // Institution permissions
  CREATE_INTERNSHIPS: 'create_internships',
  EDIT_INTERNSHIPS: 'edit_internships',
  DELETE_INTERNSHIPS: 'delete_internships',
  VIEW_STUDENTS: 'view_students',
  MANAGE_RESERVATIONS: 'manage_reservations',
  EXPORT_DATA: 'export_data',
  
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  VIEW_ALL_DATA: 'view_all_data',
  SYSTEM_CONFIG: 'system_config',
  GENERATE_REPORTS: 'generate_reports',
  FULL_ACCESS: 'full_access',
  
  // Moderator permissions
  MODERATE_CONTENT: 'moderate_content',
  REVIEW_REPORTS: 'review_reports',
  MANAGE_DISPUTES: 'manage_disputes'
};

// Default permissions for each role
export const DEFAULT_PERMISSIONS = {
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_INTERNSHIPS,
    PERMISSIONS.CREATE_RESERVATIONS,
    PERMISSIONS.CANCEL_RESERVATIONS,
    PERMISSIONS.VIEW_OWN_RESERVATIONS
  ],
  [ROLES.INSTITUTION]: [
    PERMISSIONS.CREATE_INTERNSHIPS,
    PERMISSIONS.EDIT_INTERNSHIPS,
    PERMISSIONS.DELETE_INTERNSHIPS,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.MANAGE_RESERVATIONS,
    PERMISSIONS.EXPORT_DATA
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.FULL_ACCESS
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.REVIEW_REPORTS,
    PERMISSIONS.MANAGE_DISPUTES,
    PERMISSIONS.VIEW_ALL_DATA
  ]
};

// Check if user has specific permission
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  
  // Admin has full access
  if (user.role === ROLES.ADMIN) return true;
  
  // Check user's specific permissions
  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }
  
  // Check default role permissions
  const defaultPerms = DEFAULT_PERMISSIONS[user.role] || [];
  return defaultPerms.includes(permission);
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (user, permissions) => {
  return permissions.some(permission => hasPermission(user, permission));
};

// Check if user has all specified permissions
export const hasAllPermissions = (user, permissions) => {
  return permissions.every(permission => hasPermission(user, permission));
};

// Get all permissions for a user
export const getUserPermissions = (user) => {
  if (!user || !user.role) return [];
  
  if (user.role === ROLES.ADMIN) {
    return [PERMISSIONS.FULL_ACCESS];
  }
  
  const defaultPerms = DEFAULT_PERMISSIONS[user.role] || [];
  const userPerms = user.permissions || [];
  
  return [...new Set([...defaultPerms, ...userPerms])];
};

// Role hierarchy for access control
export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 4,
  [ROLES.MODERATOR]: 3,
  [ROLES.INSTITUTION]: 2,
  [ROLES.STUDENT]: 1
};

// Check if user can manage another user based on role hierarchy
export const canManageUser = (currentUser, targetUser) => {
  if (!currentUser || !targetUser) return false;
  
  const currentLevel = ROLE_HIERARCHY[currentUser.role] || 0;
  const targetLevel = ROLE_HIERARCHY[targetUser.role] || 0;
  
  return currentLevel > targetLevel;
};

// Get role display information
export const getRoleInfo = (role) => {
  const roleInfo = {
    [ROLES.STUDENT]: {
      label: 'Estudante',
      description: 'Pode buscar e reservar vagas de estágio',
      color: 'blue',
      icon: 'FiUser'
    },
    [ROLES.INSTITUTION]: {
      label: 'Instituição',
      description: 'Pode criar e gerenciar vagas de estágio',
      color: 'green',
      icon: 'FiBuilding'
    },
    [ROLES.ADMIN]: {
      label: 'Administrador',
      description: 'Acesso total ao sistema',
      color: 'purple',
      icon: 'FiShield'
    },
    [ROLES.MODERATOR]: {
      label: 'Moderador',
      description: 'Pode moderar conteúdo e resolver disputas',
      color: 'orange',
      icon: 'FiEye'
    }
  };
  
  return roleInfo[role] || roleInfo[ROLES.STUDENT];
};

// Validate role change
export const canChangeRole = (currentUser, fromRole, toRole) => {
  // Only admins can change roles
  if (currentUser.role !== ROLES.ADMIN) return false;
  
  // Can't change admin role unless you're a super admin
  if (fromRole === ROLES.ADMIN && !currentUser.isSuperAdmin) return false;
  
  return true;
};