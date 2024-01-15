import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { Role } from './role.entity';

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

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
    role: Relation<Role>;
}
