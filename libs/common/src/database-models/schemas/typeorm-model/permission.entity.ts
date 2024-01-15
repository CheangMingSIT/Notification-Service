import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity('Permission', { schema: 'User', database: 'User' })
export class Permission {
    @PrimaryGeneratedColumn('identity', { name: 'permissionId' })
    permissionId: number;

    @Column('varchar')
    action: string;

    @Column('varchar')
    subject: string;

    @OneToMany(
        () => RolePermission,
        (rolePermission) => rolePermission.permission,
    )
    @JoinColumn([
        { name: 'permissionId', referencedColumnName: 'permissionId' },
    ])
    rolePermissions: Relation<RolePermission[]>;
}
