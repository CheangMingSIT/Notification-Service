import { Expose } from 'class-transformer';

export class UserExposeDto {
    @Expose()
    email: string;
}
