import { User } from '@app/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
@Injectable()
export class UserValidationService {
    constructor(
        @InjectRepository(User, 'postgres') private userRepo: Repository<User>,
    ) {}
    async findUser(email: string): Promise<User | undefined> {
        return await this.userRepo.findOneBy({ email });
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.findUser(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...payload } = user;
            return payload;
        } else {
            throw new InternalServerErrorException('Something went wrong');
        }
    }

    async validateRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<boolean> {
        try {
            const user = await this.userRepo.findOneBy({ userId });
            const isMatch = await bcrypt.compare(
                refreshToken,
                user.refreshToken,
            );
            return isMatch;
        } catch (e) {
            throw new InternalServerErrorException('Something went wrong');
        }
    }
}
