import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';

import type { Organisation } from './organisation.entity';
import type { RolePermission } from './role-permission.entity';
import type { User } from './user.entity';

@Entity('Role', { schema: 'User', database: 'User' })
export class Role {
    static readonly modelName = 'Role';

    @PrimaryGeneratedColumn('identity', { name: 'id' })
    id: number;

    @Column('varchar')
    role: string;

    @Column('boolean', { default: false, name: 'hasFullDataControl' })
    hasFullDataControl: boolean;

    @Column('boolean', { default: false, name: 'isDisabled' })
    isDisabled: boolean;

    @Column('varchar', { name: 'organisationId', nullable: true })
    organisationId: string;

    @ManyToOne(
        'Organisation',
        (organisation: Organisation) => organisation.roles,
    )
    @JoinColumn({ name: 'organisationId', referencedColumnName: 'id' })
    organisation: Relation<Organisation>;

    @OneToMany('User', (user: User) => user.role)
    users: User[];

    @OneToMany(
        'RolePermission',
        (rolePermission: RolePermission) => rolePermission.role,
    )
    rolePermissions: RolePermission[];
}
