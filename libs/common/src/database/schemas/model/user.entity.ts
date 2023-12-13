import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('User', { schema: 'User', database: 'User' })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

    @Column('int', { default: '1' }) // 1 = admin | 2 = user etc
    roleId: number;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn([{ name: 'roleId', referencedColumnName: 'id' }])
    role: Role;
}
