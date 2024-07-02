import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateHorarioTrabajoDto {
  @IsNotEmpty()
  @IsString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  horaFin: string;
  
  @IsNotEmpty()
  @IsEmail()
  emailDoctor: string; 
}