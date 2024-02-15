import { User } from '@app/common';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserListDto } from './dtos/user-list.dto';
import { UserRoleIdDto } from './dtos/user-role-update.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, 'postgres') private userRepo: Repository<User>,
    ) {}
    async listUsers(query: UserListDto) {
        const { page, limit, name, role } = query;
        try {
            const users = await this.userRepo.find({
                relations: ['role'],
                where: {
                    name: name ? Like(`${name}%`) : undefined,
                    role: {
                        role: role ? role : undefined,
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            });
            const payload = users.map((user) => {
                return {
                    userId: user.userId,
                    name: user.name,
                    email: user.email,
                    role: user.role.role,
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
    async getUser(userId: string) {
        try {
            const user = await this.userRepo.findOne({
                where: { userId },
                relations: ['role'],
            });
            if (!user) {
                throw new BadRequestException('User does not exist');
            }
            return {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role.role,
            };
        } catch (error) {
            console.error('Error occurred while getting user:', error);
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
