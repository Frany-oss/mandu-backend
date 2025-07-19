import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateDivisionDto {
  @IsString()
  @MaxLength(45, { message: 'El nombre no puede superar los 45 caracteres' })
  nombre: string;

  @IsOptional()
  @IsInt({ message: 'La división superior debe ser un número entero' })
  @Min(1, { message: 'El ID de la división superior debe ser positivo' })
  divisionSuperiorId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'El nombre del embajador no puede superar los 100 caracteres',
  })
  embajadorNombre?: string;
}
