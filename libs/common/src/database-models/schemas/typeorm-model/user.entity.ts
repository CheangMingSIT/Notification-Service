import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { Role } from './role.entity';
import type { ApiKeys } from './apikey.entity';

@Entity('User', { schema: 'User', database: 'User' })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

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

    @OneToMany('ApiKeys', (apiKeys: ApiKeys) => apiKeys.user)
    apiKeys: ApiKeys[];

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
    role: Relation<Role>;
}
