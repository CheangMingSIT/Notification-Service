import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ApiKeys', { schema: 'User', database: 'User' })
export class ApiKeys {
    @PrimaryGeneratedColumn('uuid', { name: 'apiKeyId' })
    apiKeyId: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    apiKey: string;
}
