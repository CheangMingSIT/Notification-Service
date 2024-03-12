import { OmitType } from '@nestjs/swagger';
import { organisationDto } from './organisation.dto';

export class updateOrganisation extends OmitType(organisationDto, [
    'name',
] as const) {}
