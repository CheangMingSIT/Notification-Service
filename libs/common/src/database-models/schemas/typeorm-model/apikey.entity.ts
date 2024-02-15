import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import type { User } from './user.entity';

@Entity('ApiKey', { schema: 'User', database: 'User' })
export class ApiKey {
    static readonly modelName = 'ApiKey';
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    secretKey: string;

    @Column('uuid', { name: 'userId', nullable: true })
    userId: string;

    @ManyToOne('User', (user: User) => user.apiKeys, { nullable: true })
    @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
    user: Relation<User>;
}
