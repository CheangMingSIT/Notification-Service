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
import type { Role } from './role.entity';

@Entity('User', { schema: 'User', database: 'User' })
export class User {
    static readonly modelName = 'User';

    @PrimaryGeneratedColumn('uuid', { name: 'userId' })
    userId: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

    @Column('int', { default: '3' }) // 1 = admin | 3 = user etc
    roleId: number;

    @Column('varchar', { nullable: true })
    refreshToken: string;

    @OneToMany('ApiKey', (apiKey: ApiKey) => apiKey.user)
    apiKeys: ApiKey[];

    @ManyToOne('Role', (role: Role) => role.users)
    @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
    role: Relation<Role>;

    @Column('boolean', { default: false, name: 'disabled' })
    disabled: boolean;
}
