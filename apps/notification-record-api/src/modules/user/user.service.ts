import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/common';

@Injectable()
export class UserService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User, 'postgres') private repo: Repository<User>,
    ) {}
    async signIn(user: any) {
        const payload = {
            id: user.id,
            username: user.username,
            roleId: user.roleId,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(email: string, password: string) {
        const user = await this.repo.findOneBy({ email });
        if (user) {
            throw new BadRequestException('User already exists');
        }
    }

    async deleteUser(username: string) {}
}
