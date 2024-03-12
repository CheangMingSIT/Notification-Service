import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import type { RolePermission } from './role-permission.entity';

@Entity('Permission', { schema: 'User', database: 'User' })
export class Permission {
    static readonly modelName = 'Permission';
    @PrimaryGeneratedColumn('identity', { name: 'permissionId' })
    permissionId: number;

    @Column('varchar')
    operation: string;

    @Column('varchar')
    resource: string;

    @OneToMany(
        'RolePermission',
        (rolePermission: RolePermission) => rolePermission.permission,
    )
    @JoinColumn([
        { name: 'permissionId', referencedColumnName: 'permissionId' },
    ])
    rolePermissions: Relation<RolePermission[]>;
}
