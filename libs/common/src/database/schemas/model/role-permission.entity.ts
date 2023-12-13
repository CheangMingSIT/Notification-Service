import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity('RolePermission', { schema: 'User', database: 'User' })
export class RolePermission {
    @PrimaryColumn('int', { name: 'roleId' })
    roleId: number;

    @PrimaryColumn('int', { name: 'permissionId' })
    permissionId: number;

    @ManyToOne(() => Role, (role) => role.rolePermissions)
    @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
    role: Role;

    @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
    @JoinColumn([
        { name: 'permissionId', referencedColumnName: 'permissionId' },
    ])
    permission: Permission;
}
