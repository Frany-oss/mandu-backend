/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreateDivisionDto } from './divisiones.create.dto';

export class UpdateDivisionDto extends PartialType(CreateDivisionDto) {}
