/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsOptional,
  Length,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateSubdivisionDto {
  @IsOptional()
  @IsString()
  @Length(1, 45)
  nombre?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  divisionId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  nivel?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  cantidadColaboradores?: number;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  embajadorNombre?: string;
}
