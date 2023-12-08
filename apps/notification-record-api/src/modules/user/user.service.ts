import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private jwtService: JwtService) {}
    async signIn(user: any) {
        const payload = {
            user_id: user.userId,
            username: user.username,
            isAdmin: user.isAdmin,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
