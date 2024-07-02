import { IsNotEmpty, IsString } from 'class-validator';

export class BuscarDisponibilidadDto {
  @IsNotEmpty()
  @IsString()
  especialidad: string;

  @IsNotEmpty()
  @IsString()
  tipoCita: string;

  @IsNotEmpty()
  @IsString()
  horarioPreferido: string;
}