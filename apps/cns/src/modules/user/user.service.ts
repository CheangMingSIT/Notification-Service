import { User } from '@app/common';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDeleteDto } from './dtos/user-delete.dto';
import { UserUpdateDto } from './dtos/user-role-update.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, 'postgres') private userRepo: Repository<User>,
    ) {}
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
            throw new BadRequestException(e.message);
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
