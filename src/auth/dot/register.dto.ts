import { Transform } from "class-transformer";
import { IsEmail, IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    nombre: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  
    @IsString()
    tipoUsuario: string;

    @IsNumber()
    edad: number;
    
    @IsString()
    apellido: string;
  
    @IsString()
    direccion: string;
  
    @IsString()
    rut: string;
  
    @IsString()
    seguroMedico: string;
  
  }