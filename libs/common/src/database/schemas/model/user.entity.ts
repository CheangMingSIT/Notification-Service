import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_user', { schema: 'postgres', database: 'postgres' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    roleId: number;
}
