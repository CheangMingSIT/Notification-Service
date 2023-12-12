export interface Users {
    uuid: number;
    email: string;
    password: string;
    roleId: number;
}
export interface Role {
    id: number;
    role: string;
}

export interface RolePermission {
    id: number;
    roleId: number;
    permissionId: number;
}

export interface Permission {
    id: number;
    action: string;
    subject: string;
}

export const user: Users[] = [
    { uuid: 1, email: 'admin', password: 'admin', roleId: 1 },
    { uuid: 2, email: 'manager', password: 'manager', roleId: 2 },
    { uuid: 3, email: 'user', password: 'user', roleId: 3 },
];

export const role: Role[] = [
    { id: 1, role: 'admin' },
    { id: 2, role: 'manager' },
    { id: 3, role: 'user' },
];

export const rolePermission: RolePermission[] = [
    { id: 1, roleId: 1, permissionId: 1 },
    { id: 2, roleId: 2, permissionId: 2 },
    { id: 3, roleId: 2, permissionId: 3 },
    { id: 4, roleId: 3, permissionId: 3 },
    { id: 5, roleId: 3, permissionId: 5 },
];

export const permission: Permission[] = [
    { id: 1, action: 'manage', subject: 'ApiKey' },
    { id: 2, action: 'create', subject: 'ApiKey' },
    { id: 3, action: 'read', subject: 'ApiKey' },
    { id: 4, action: 'update', subject: 'ApiKey' },
    { id: 5, action: 'delete', subject: 'ApiKey' },
];
