import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import type { User } from './user.entity';

@Entity('Organisation', { schema: 'User', database: 'User' })
export class Organisation {
    static readonly modelName = 'Organisation';
    constructor(name: string) {
        this.name = name;
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar')
    name: string;

    @Column('jsonb', { name: 'condition', nullable: true })
    condition: object;

    @Column('boolean', { name: 'isDisabled', default: false })
    isDisabled: boolean;

    @OneToMany('User', (user: User) => user.organisation)
    users: User[];

    @OneToMany('Role', (role: Role) => role.organisation)
    roles: Role[];
}
