export interface Users {
    id: number;
    username: string;
    password: string;
}

interface user_role {
    id: number;
    user_id: number;
    role_id: number;
}

interface role {
    id: number;
    name: string;
}

interface role_permission {
    id: number;
    role_id: number;
    permission_id: number;
}

interface permission {
    id: number;
    name: string;
}

export const users: Users[] = [
    { id: 1, username: 'admin', password: 'admin' },
    { id: 2, username: 'manager', password: 'manager' },
    { id: 3, username: 'user', password: 'user' },
];

export const user_roles: user_role[] = [
    { id: 1, user_id: 1, role_id: 1 },
    { id: 2, user_id: 2, role_id: 2 },
    { id: 3, user_id: 3, role_id: 3 },
];

export const roles: role[] = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'manager' },
    { id: 3, name: 'user' },
];

export const role_permissions: role_permission[] = [
    { id: 1, role_id: 1, permission_id: 1 },
    { id: 2, role_id: 2, permission_id: 2 },
    { id: 3, role_id: 3, permission_id: 3 },
];

export const permissions: permission[] = [
    { id: 1, name: 'create' },
    { id: 2, name: 'read' },
    { id: 3, name: 'update' },
    { id: 4, name: 'delete' },
];
