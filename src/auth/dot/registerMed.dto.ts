import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterProfesionalDto {
    @IsString()
    nombre: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  
    // Atributos específicos de profesional
    @IsString()
    especialidad: string;
  
    @IsString()
    horarioTrabajo: string;
  }