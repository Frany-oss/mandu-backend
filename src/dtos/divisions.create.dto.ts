/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDivisionDto {
  @IsString()
  @MaxLength(45, { message: 'El nombre no puede superar los 45 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La división superior debe ser un nombre correcto' })
  divisionSuperiorNombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'El nombre del embajador no puede superar los 100 caracteres',
  })
  @Transform(({ value }) => value?.trim())
  embajadorNombre?: string;
}
