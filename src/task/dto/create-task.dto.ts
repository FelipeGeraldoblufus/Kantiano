import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsString()
  equiporesponsable: string;

  @IsString()
  proyecto: string;

  @IsOptional()
  @IsDateString()
  fechaInicio?: Date;

  @IsOptional()
  @IsDateString()
  fechaTermino?: Date;
}