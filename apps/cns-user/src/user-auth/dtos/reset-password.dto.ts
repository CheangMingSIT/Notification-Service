import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class ResetPassword extends PickType(UserDto, ['password'] as const) {}
