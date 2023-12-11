import { User } from '@app/common';
import {
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userRecord: Model<User>,
    ) {}
    async signIn(user: any) {
        const payload = {
            id: user.id,
            username: user.username,
            roleId: user.RoleId,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(username: string, password: string) {
        try {
            const user = new this.userRecord({
                username: username,
                password: password,
            });
            await user.save();
            return {
                message: 'User created successfully',
            };
        } catch (error) {
            throw new NotAcceptableException(error);
        }
    }

    async deleteUser(username: string) {
        try {
            await this.userRecord.deleteOne({ username: username });
            return {
                message: 'User deleted successfully',
            };
        } catch (error) {
            throw new NotFoundException(error);
        }
    }
}
