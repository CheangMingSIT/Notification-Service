import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserDto } from '../../user-auth/dtos/user.dto';

export class OrganisationAdminDto extends OmitType(UserDto, [
    'roleId',
] as const) {
    @ApiProperty({ type: String, format: 'uuid' })
    @IsUUID()
    @IsNotEmpty({ message: 'organisationId is required' })
    organisationId: string;
}
