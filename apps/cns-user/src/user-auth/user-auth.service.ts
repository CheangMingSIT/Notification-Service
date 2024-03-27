import { User } from '@app/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
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
        if (user?.user === 'Owner') {
            const payload = {
                user: 'Owner',
                role: 'Owner',
                organisation: 'IT Biz',
            };
            const access_token = await this.jwtService.signAsync(payload);
            return access_token;
        }
        const payload = {
            userId: user.userId,
            email: user.email,
            roleId: user.roleId,
            organisationId: user.organisationId,
            refreshToken: user.refreshToken,
        };
        try {
            const access_token = await this.jwtService.signAsync(payload);
            const hash_token = await this.hashPassword(access_token);
            await this.userRepo.update(user.userId, {
                refreshToken: hash_token,
            });
            return access_token;
        } catch (error) {
            console.error('Error occurred while signing in:', error);
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async signUp(
        body: {
            name: string;
            email: string;
            password: string;
            roleId: number;
        },
        organisationId: string,
    ) {
        const { name, email, password, roleId } = body;
        try {
            const existingUser = await this.userRepo.findOneBy({ email });
            if (existingUser) {
                throw new BadRequestException('User already exists');
            }
            const hash = await this.hashPassword(password);
            const newUser = this.userRepo.create({
                name,
                email,
                password: hash,
                roleId,
                organisationId,
            });
            await this.userRepo.save(newUser);
            return 'User created successfully';
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error('Error occurred while creating user:', error);
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async logout(userId: string) {
        try {
            this.userRepo.update(userId, { refreshToken: null });
            return 'Logged out successfully';
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async refreshToken(user: any): Promise<string> {
        try {
            if (user.role === 'Owner') {
                const payload = {
                    user: user.user,
                    role: user.role,
                    organisation: user.organisation,
                };
                const token = await this.jwtService.signAsync(payload);
                return token;
            }

            const { userId, email, roleId, organisationId } = user;
            const token = await this.jwtService.signAsync({
                userId,
                email,
                roleId,
                organisationId,
            });
            const hashedToken = await this.hashPassword(token);
            await this.userRepo.update(userId, {
                refreshToken: hashedToken,
            });
            return token;
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            console.error('Error occurred while refreshing token:', error);
            throw new InternalServerErrorException(error.message);
        }
    }

    async requestPasswordResetLink(email: string) {
        try {
            const user = await this.userRepo.findOneBy({ email });
            if (!user) {
                throw new BadRequestException('User does not exist');
            }
            const payload = {
                userId: user.userId,
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
            const response = await this.mailerService.sendMail(message);
            if (response.response.includes('250')) {
                await this.userRepo.update(user, {
                    refreshToken: token,
                });
            }
            return token;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error(
                    'Error occurred while sending reset password link:',
                    error,
                );
                throw new BadRequestException(error.message);
            }
        }
    }

    async resetPassword(user: any, password: string) {
        try {
            const existingUser = await this.userRepo.findOneBy({
                userId: user.userId,
            });
            if (!existingUser) {
                throw new BadRequestException('User does not exist');
            }
            const hash = await this.hashPassword(password);
            await this.userRepo.update(existingUser, {
                password: hash,
            });
            const newToken = await this.jwtService.signAsync({
                userId: user.userId,
                email: user.email,
                roleId: user.roleId,
            });

            const hash_token = await this.hashPassword(newToken);
            await this.userRepo.update(user.userId, {
                refreshToken: hash_token,
            });
            return 'Password reset successfully';
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error(
                    'Error occurred while resetting password:',
                    error,
                );
                throw new BadRequestException(error.message);
            }
        }
    }
}
