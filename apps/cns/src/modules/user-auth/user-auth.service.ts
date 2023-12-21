import { User } from '@app/common';
import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { userDto } from './dtos/user.dto';

@Injectable()
export class UserAuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User, 'postgres') private userRepo: Repository<User>,
    ) {}

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async signIn(user: any) {
        const payload = {
            uuid: user.uuid,
            email: user.email,
            roleId: user.roleId,
            refreshToken: user.refreshToken,
        };
        const access_token = await this.jwtService.signAsync(payload);
        const hash_token = await this.hashPassword(access_token);
        await this.userRepo.update(user.uuid, {
            refreshToken: hash_token,
        });
        return access_token;
    }

    async signUp(body: userDto) {
        const { email, password } = body;
        const existingUser = await this.userRepo.findOneBy({ email });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        const hash = await this.hashPassword(password);
        try {
            const newUser = this.userRepo.create({
                email,
                password: hash,
            });
            const saveUser = await this.userRepo.save(newUser);
            return saveUser;
        } catch (e) {
            throw new HttpException(
                "Couldn't create user",
                HttpStatus.BAD_REQUEST,
                { cause: e.message, description: 'User creation failed' },
            );
        }
    }

    async logout(uuid: string) {
        try {
            this.userRepo.update(uuid, { refreshToken: null });
            return {
                status: HttpStatus.OK,
                message: 'Successfully logged out user',
            };
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    async refreshToken(user: {
        uuid: string;
        email: string;
        roleId: string;
        refreshToken: string;
    }) {
        const { uuid, email, roleId, refreshToken } = user;
        const payload = await this.userRepo.findOneBy({ uuid });
        if (!payload || !payload.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }
        const isMatch = await bcrypt.compare(
            refreshToken,
            payload.refreshToken,
        );
        if (!isMatch) {
            throw new ForbiddenException('Access Denied');
        }
        const token = await this.jwtService.signAsync({
            uuid,
            email,
            roleId,
        });
        const hash_token = await this.hashPassword(token);
        await this.userRepo.update(uuid, {
            refreshToken: hash_token,
        });
        return token;
    }
}
