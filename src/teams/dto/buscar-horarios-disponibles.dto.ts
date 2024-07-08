import { IsNotEmpty, IsString } from 'class-validator';

export class BuscarHorariosDisponiblesDto {
  @IsNotEmpty()
  @IsString()
  especialidad: string;

  @IsNotEmpty()
  @IsString()
  tipoCita: string;

  @IsNotEmpty()
  @IsString()
  horarioPreferido: string;

  @IsNotEmpty()
  @IsString()
  fechaSeleccionada: string;
}