import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { User } from './user.entity';

@Entity('Organisation', { schema: 'User', database: 'User' })
export class Organisation {
    constructor(name: string) {
        this.name = name;
    }
    static readonly modelName = 'Organisation';
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar')
    name: string;

    @Column('jsonb', { name: 'condition', nullable: true })
    condition: object;

    @OneToMany('User', (user: User) => user.organisation)
    users: User[];
}
