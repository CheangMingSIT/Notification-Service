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
    action: string;

    @Column('varchar')
    subject: string;

    @Column('jsonb', { nullable: true })
    conditions: object | null;

    @OneToMany(
        'RolePermission',
        (rolePermission: RolePermission) => rolePermission.permission,
    )
    @JoinColumn([
        { name: 'permissionId', referencedColumnName: 'permissionId' },
    ])
    rolePermissions: Relation<RolePermission[]>;
}
