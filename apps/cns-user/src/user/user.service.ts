import { PaginationDto, User } from '@app/common';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
                    userId: user.userId,
                    email: user.email,
                    roleId: user.roleId,
                };
            });
            return {
                data: {
                    users: payload,
                    page: page,
                    limit: limit,
                },
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateUser(userId: string, userRole: UserRoleIdDto) {
        try {
            const existingUser = await this.userRepo.findOneBy({ userId });
            if (!existingUser) {
                throw new BadRequestException('User does not exist');
            }
            await this.userRepo.update(existingUser.userId, {
                roleId: userRole.roleId,
            });
            return 'Successfully updated user';
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error('Error occurred while updating user:', error);
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async deleteUser(userId: string) {
        try {
            const existingUser = await this.userRepo.findOneBy({
                userId,
            });
            if (!existingUser) {
                throw new BadRequestException('User does not exist');
            }
            await this.userRepo.delete(userId);
            return 'Successfully deleted user';
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error('Error occurred while deleting user:', error);
                throw new InternalServerErrorException(error.message);
            }
        }
    }
}
