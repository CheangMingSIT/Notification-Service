import { Injectable } from '@nestjs/common';
import { Users, users } from '../authorization/Data/user-data.resource';
@Injectable()
export class UserAuthService {
    private readonly users: Users[] = users;
    async findUser(username: string): Promise<Users | undefined> {
        return this.users.find((user) => user.username === username);
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.findUser(username);
        if (user && user.password === pass) {
            const { password, ...payload } = user;
            return payload;
        }
        return null;
    }
}
