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
    constructor(
        name: string,
        secretKey: string,
        isDisabled: boolean,
        userId: string,
    ) {
        this.name = name;
        this.secretKey = secretKey;
        this.isDisabled = isDisabled;
        this.userId = userId;
    }
    static readonly modelName = 'ApiKey';
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    secretKey: string;

    @Column('boolean', { name: 'isDisabled', default: false })
    isDisabled: boolean;

    @Column('uuid', { name: 'userId', nullable: true })
    userId: string;

    @ManyToOne('User', (user: User) => user.apiKeys, { nullable: true })
    @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
    user: Relation<User>;
}
