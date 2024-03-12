import { PickType } from '@nestjs/swagger';
import { organisationDto } from './organisation.dto';

export class createOrganisationDto extends PickType(organisationDto, [
    'name',
] as const) {}
