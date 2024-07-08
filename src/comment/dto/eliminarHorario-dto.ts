import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class EliminarHorarioDto {
  @IsEmail()
  @IsNotEmpty()
  emailDoctor: string;

  @IsNumber()
  @IsNotEmpty()
  horarioId: number;
}