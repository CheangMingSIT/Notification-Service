import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import type { User } from './user.entity';

@Entity('ApiKeys', { schema: 'User', database: 'User' })
export class ApiKeys {
    @PrimaryGeneratedColumn('uuid', { name: 'apiKeyId' })
    apiKeyId: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    apiKey: string;

    @Column('uuid', { name: 'userId' })
    userId: string;

    @ManyToOne('User', (user: User) => user.apiKeys, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn([{ name: 'userId', referencedColumnName: 'uuid' }])
    user: Relation<User>;
}
