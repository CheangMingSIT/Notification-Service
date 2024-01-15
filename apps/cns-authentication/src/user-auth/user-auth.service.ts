import { User } from '@app/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User, 'postgres') private userRepo: Repository<User>,
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) {}

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async signIn(user: any): Promise<Object> {
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
        return { token: access_token };
    }

    async signUp(body: { name: string; email: string; password: string }) {
        const { name, email, password } = body;
        const existingUser = await this.userRepo.findOneBy({ email });
        if (existingUser) {
            throw new HttpException('User already exists', HttpStatus.OK);
        }
        const hash = await this.hashPassword(password);
        try {
            const newUser = this.userRepo.create({
                name,
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
    }): Promise<string> {
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

    async requestPasswordResetLink(email: string) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.OK);
        }
        const payload = {
            uuid: user.uuid,
            email: user.email,
            roleId: user.roleId,
        };
        const token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            algorithm: 'HS256',
            expiresIn: '1m',
        });
        const reset_password_link =
            this.configService.get('RESET_PASSWORD_URL');

        const message = {
            to: user.email,
            subject: 'Reset Password',
            text: `Reset Password Link: ${reset_password_link}?token=${token}`,
        };
        try {
            const response = await this.mailerService.sendMail(message);
            if (response.response.includes('250')) {
                await this.userRepo.update(user, {
                    refreshToken: token,
                });
            }
            return {
                token: token,
                status: HttpStatus.OK,
                message: 'Reset Password Link sent successfully',
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async resetPassword(user: any, password: string) {
        const existingUser = await this.userRepo.findOneBy({ uuid: user.uuid });
        if (!existingUser) {
            throw new HttpException('User does not exist', HttpStatus.OK);
        }
        const hash = await this.hashPassword(password);
        await this.userRepo.update(existingUser, {
            password: hash,
        });
        const newToken = await this.jwtService.signAsync({
            uuid: user.uuid,
            email: user.email,
            roleId: user.roleId,
        });
        try {
            const hash_token = await this.hashPassword(newToken);
            await this.userRepo.update(user.uuid, {
                refreshToken: hash_token,
            });
            return {
                status: HttpStatus.OK,
                message: 'Password reset successfully',
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
