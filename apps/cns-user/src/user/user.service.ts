import { CaslAbilityFactory, Operation } from '@app/auth';
import { Role, RolePermission, User } from '@app/common';
import { rulesToAST } from '@casl/ability/extra';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Like, Repository } from 'typeorm';
import { UserListDto } from './dtos/user-list.dto';
import { UserRoleIdDto } from './dtos/user-role-update.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, 'postgres') private userRepo: Repository<User>,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        @InjectRepository(Role, 'postgres') private roleRepo: Repository<Role>,
        @InjectRepository(RolePermission, 'postgres')
        private rolePermissionRepo: Repository<RolePermission>,
    ) {}
    async listUsers(query: UserListDto, user: any) {
        const ability = await this.caslAbilityFactory.defineAbilitiesFor(user);
        const condition = rulesToAST(ability, Operation.Read, 'User');
        const { name, role } = query;
        try {
            const users = await this.userRepo.find({
                relations: ['role'],
                where: {
                    name: name ? Like(`${name}%`) : undefined,
                    role: role ? { role } : undefined,
                    organisationId: condition['field']?.includes(
                        'organisationId',
                    )
                        ? condition['value'].toString()
                        : undefined,
                },
            });

            const payload = users.map((user) => ({
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role.role,
                isDisabled: user.isDisabled,
            }));

            return {
                data: {
                    users: payload,
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
                relations: ['role', 'organisation'],
            });
            if (!user) {
                throw new BadRequestException('User does not exist');
            }
            return {
                userId: user.userId,
                name: user.name,
                email: user.email,
                roleId: user.roleId,
                role: user.role.role,
                organisationId: user.organisationId,
                organisationName: user.organisation?.name || 'No Organisation',
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

    async enableUser(userId: string) {
        try {
            const existingUser = await this.userRepo.findOne({
                where: { userId },
            });
            if (!existingUser) {
                throw new BadRequestException('User does not exist');
            }
            await this.userRepo.update(existingUser.userId, {
                isDisabled: false,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error('Error occurred while enabling user:', error);
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async disableUser(userId: string) {
        try {
            const existingUser = await this.userRepo.findOne({
                where: { userId },
            });
            if (!existingUser) {
                throw new BadRequestException('User does not exist');
            }
            await this.userRepo.update(existingUser.userId, {
                isDisabled: true,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error('Error occurred while disabling user:', error);
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async addAdminUser(user: {
        name: string;
        email: string;
        password: string;
        organisationId: string;
    }) {
        try {
            const existingUser = await this.userRepo.findOne({
                where: { email: user.email },
            });

            if (existingUser) {
                throw new BadRequestException('User already exists');
            }

            const adminRole = await this.roleRepo.findOne({
                where: { role: 'Admin', organisationId: user.organisationId },
            });

            let roleId: number;

            if (adminRole) {
                roleId = adminRole.id;
            } else {
                const newAdminRole = this.roleRepo.create({
                    role: 'Admin',
                    hasFullDataControl: true,
                    organisationId: user.organisationId,
                });
                await this.roleRepo.save(newAdminRole);
                roleId = newAdminRole.id;
            }

            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(user.password, salt);

            const admin = this.userRepo.create({
                name: user.name,
                email: user.email,
                password: hash,
                roleId,
                organisationId: user.organisationId,
            });
            const batchSavePromises = [
                this.userRepo.save(admin),
                this.rolePermissionRepo.save({
                    roleId,
                    permissionId: 1,
                }),
            ];
            await Promise.all(batchSavePromises);
            return `Successfully added ${admin.name} as admin user`;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred while adding admin user:', error);
            throw new InternalServerErrorException(error.message);
        }
    }
}
