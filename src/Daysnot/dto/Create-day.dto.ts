import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateDiaNoDisponibleDto {
  @IsNotEmpty()
  @IsDate()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  motivo: string;
}