import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { RolePermission } from './role-permission.entity';
import type { User } from './user.entity';

@Entity('Role', { schema: 'User', database: 'User' })
export class Role {
    @PrimaryGeneratedColumn('rowid', { name: 'id' })
    id: number;

    @Column('varchar')
    role: string;

    @OneToMany('User', (user: User) => user.role)
    users: User[];

    @OneToMany(
        'RolePermission',
        (rolePermission: RolePermission) => rolePermission.role,
    )
    rolePermissions: RolePermission[];
}
