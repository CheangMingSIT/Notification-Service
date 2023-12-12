import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User', { schema: 'User', database: 'User' })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: '1' }) // 1 = admin | 2 = user etc
    roleId: number;
}
