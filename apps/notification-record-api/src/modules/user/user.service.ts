import { User } from '@app/common';
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserDeleteDto } from './dtos/user-delete.dto';
import { UserRegistrationDto } from './dtos/user-registration.dto';
import { UserUpdateDto } from './dtos/user-role-update.dto';

@Injectable()
export class UserService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User, 'postgres') private userRepo: Repository<User>,
    ) {}
    async signIn(user: any) {
        const payload = {
            uuid: user.uuid,
            email: user.email,
            roleId: user.roleId,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(body: UserRegistrationDto) {
        const { email, password } = body;
        const existingUser = await this.userRepo.findOneBy({ email });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
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

    async updateUser(body: UserUpdateDto) {
        const { roleId, email } = body;
        const existingUser = await this.userRepo.findOneBy({ email });
        if (!existingUser) {
            throw new BadRequestException('User does not exist');
        }
        try {
            await this.userRepo.update(existingUser.uuid, {
                roleId: roleId,
            });
            return {
                status: HttpStatus.OK,
                message: 'Successfully updated user',
            };
        } catch (e) {
            throw new HttpException(
                "Couldn't update user",
                HttpStatus.BAD_REQUEST,
                { cause: e.message, description: 'User update failed' },
            );
        }
    }

    async deleteUser(body: UserDeleteDto) {
        const existingUser = await this.userRepo.findOneBy({
            email: body.email,
        });
        if (!existingUser) {
            throw new BadRequestException('User does not exist');
        }
        try {
            await this.userRepo.delete(existingUser.uuid);
            return {
                status: HttpStatus.OK,
                message: 'Successfully deleted user',
            };
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
