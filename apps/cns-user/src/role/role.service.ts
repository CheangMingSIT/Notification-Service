import { Role } from '@app/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role, 'postgres') private roleRepo: Repository<Role>,
    ) {}

    async listRoles() {
        try {
            const roles = await this.roleRepo.find();
            return roles;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
