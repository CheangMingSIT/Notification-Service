import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { RolePermission } from './role-permission.entity';

@Entity('Role', { schema: 'User', database: 'User' })
export class Role {
    @PrimaryGeneratedColumn('rowid', { name: 'id' })
    id: number;

    @Column('varchar')
    role: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[];
}
