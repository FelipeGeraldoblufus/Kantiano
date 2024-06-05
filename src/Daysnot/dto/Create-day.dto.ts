import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateDiaNoDisponibleDto {
  @IsNotEmpty()
  @IsDate()
  fecha: Date;

  @IsNotEmpty()
  @IsString()
  motivo: string;
}