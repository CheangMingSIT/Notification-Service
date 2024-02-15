import { PaginationDto } from '@app/common';
import { IntersectionType } from '@nestjs/swagger';
import { PermissionDto } from './permssion.dto';

export class PermissionListDto extends IntersectionType(
    PaginationDto,
    PermissionDto,
) {}
