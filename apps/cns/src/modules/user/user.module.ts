import { CaslAbilityModule } from '@app/auth';
import { Role, RolePermission, User } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, RolePermission], 'postgres'),
        CaslAbilityModule,
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
