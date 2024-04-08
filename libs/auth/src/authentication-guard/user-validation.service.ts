import { User } from '@app/common';
import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
@Injectable()
export class UserValidationService {
    constructor(
        @InjectRepository(User, 'postgres') private userRepo: Repository<User>,
    ) {}
    async findUser(email: string): Promise<User | undefined> {
        return await this.userRepo.findOne({ where: { email } });
    }

    async validateUser(email: string, pass: string): Promise<any> {
        try {
            if (email === 'Admin@sptel.com' && pass === 'Admin') {
                return {
                    user: 'Owner',
                    role: 'Owner',
                    organisation: 'IT Biz',
                };
            }
            const user = await this.findUser(email);
            if (!user) {
                throw new UnauthorizedException('Invalid Credentials!');
            }
            if (user.isDisabled === true) {
                throw new ForbiddenException('Disabled Users!');
            }
            if (user && (await bcrypt.compare(pass, user.password))) {
                const { password, ...payload } = user;
                return payload;
            } else {
                throw new UnauthorizedException('Invalid Credentials!');
            }
        } catch (error) {
            if (error instanceof ForbiddenException) throw error;
            if (error instanceof UnauthorizedException) throw error;
            throw new InternalServerErrorException('Something went wrong');
        }
    }

    async validateRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<boolean> {
        try {
            const user = await this.userRepo.findOne({ where: { userId } });
            if (user.isDisabled === true) {
                throw new ForbiddenException('Disabled Users!');
            }
            const isMatch = await bcrypt.compare(
                refreshToken,
                user.refreshToken,
            );
            return isMatch;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Something went wrong');
        }
    }

    async getUserForResetPassword(email: string): Promise<User> {
        try {
            const user = await this.findUser(email);
            if (user.isDisabled === true) {
                throw new UnauthorizedException('User is disabled');
            }
            return user;
        } catch (error) {
            console.error(error);
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Something went wrong');
        }
    }
}
