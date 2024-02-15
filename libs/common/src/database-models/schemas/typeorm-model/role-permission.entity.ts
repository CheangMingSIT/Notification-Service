import {
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    Relation,
} from 'typeorm';
import type { Permission } from './permission.entity';
import type { Role } from './role.entity';

@Entity('RolePermission', { schema: 'User', database: 'User' })
export class RolePermission {
    static readonly modelName = 'RolePermission';
    @PrimaryColumn('int', { name: 'roleId' })
    roleId: number;

    @PrimaryColumn('int', { name: 'permissionId' })
    permissionId: number;

    @ManyToOne('Role', (role: Role) => role.rolePermissions)
    @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
    role: Role;

    @ManyToOne(
        'Permission',
        (permission: Permission) => permission.rolePermissions,
    )
    @JoinColumn([
        { name: 'permissionId', referencedColumnName: 'permissionId' },
    ])
    permission: Relation<Permission>;
}
