import { PartialType } from '@nestjs/mapped-types';
import { CreateDivisionDto } from './divisions.create.dto';

export class UpdateDivisionDto extends PartialType(CreateDivisionDto) {}
