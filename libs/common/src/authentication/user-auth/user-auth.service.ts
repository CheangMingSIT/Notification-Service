import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import * as fs from 'fs';

const reqPath = join(__dirname, '../');
const publicKey = fs.readFileSync(reqPath + 'keys/public.key', 'utf8');
export type User = any;
@Injectable()
export class UserAuthService {
    private readonly users = [
        {
            userId: 1,
            username: 'CM',
            password: 'changeme',
        },
    ];
    constructor(private jwtService: JwtService) {}

    async findUser(username: string): Promise<User | undefined> {
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

    async validateJwtToken(apiKey: string): Promise<any> {
        return await this.jwtService.verifyAsync(apiKey, {
            publicKey: publicKey,
        });
    }
}
