import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import type { ApiKey } from './apikey.entity';
import type { Organisation } from './organisation.entity';
import type { Role } from './role.entity';

@Entity('User', { schema: 'User', database: 'User' })
export class User {
    constructor(
        userId: string,
        name: string,
        email: string,
        password: string,
        roleId: number,
        refreshToken: string,
        role: Role,
        orgainsationId: string,
        disabled: boolean,
    ) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.roleId = roleId;
        this.refreshToken = refreshToken;
        this.organisationId = orgainsationId;
        this.role = role;
        this.disabled = disabled;
    }
    static readonly modelName = 'User';

    @PrimaryGeneratedColumn('uuid', { name: 'userId' })
    userId: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

    @Column('int', { default: '2' }) // 1 = admin | 2 = user etc
    roleId: number;

    @Column('varchar', { nullable: true })
    refreshToken: string;

    @Column('uuid', { name: 'organisationId', nullable: true })
    organisationId: string;

    @OneToMany('ApiKey', (apiKey: ApiKey) => apiKey.user)
    apiKeys: ApiKey[];

    @ManyToOne(
        'Organisation',
        (organisation: Organisation) => organisation.users,
    )
    @JoinColumn([{ name: 'organisationId', referencedColumnName: 'id' }])
    organisation: Relation<Organisation>;

    @ManyToOne('Role', (role: Role) => role.users)
    @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
    role: Relation<Role>;

    @Column('boolean', { default: false, name: 'disabled' })
    disabled: boolean;
}
