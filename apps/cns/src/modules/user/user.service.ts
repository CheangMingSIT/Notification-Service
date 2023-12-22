import { User } from '@app/common';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { UserRoleIdDto } from './dtos/user-role-update.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, 'postgres') private userRepo: Repository<User>,
    ) {}
    async listUsers(query: PaginationDto) {
        const { page, limit } = query;
        try {
            const users = await this.userRepo.find({
                skip: (page - 1) * limit,
                take: limit,
            });
            const payload = users.map((user) => {
                return {
                    email: user.email,
                    roleId: user.roleId,
                };
            });
            return {
                status: HttpStatus.OK,
                message: 'Successfully fetched users',
                data: {
                    users: payload,
                    total_no_of_user: users.length,
                    page: page,
                    limit: limit,
                },
            };
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    async updateUser(uuid: string, userRole: UserRoleIdDto) {
        const existingUser = await this.userRepo.findOneBy({ uuid });
        if (!existingUser) {
            throw new BadRequestException('User does not exist');
        }
        try {
            await this.userRepo.update(existingUser.uuid, {
                roleId: userRole.roleId,
            });
            return {
                status: HttpStatus.OK,
                message: 'Successfully updated user',
            };
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    async deleteUser(uuid: string) {
        const existingUser = await this.userRepo.findOneBy({
            uuid,
        });
        if (!existingUser) {
            throw new BadRequestException('User does not exist');
        }
        try {
            await this.userRepo.delete(uuid);
            return {
                status: HttpStatus.OK,
                message: 'Successfully deleted user',
            };
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
