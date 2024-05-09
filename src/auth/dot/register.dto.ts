import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    name: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  
    @IsString()
    role: string;
  
    @IsString()
    apellido: string;
  
    @IsString()
    direccion: string;
  
    @IsString()
    rut: string;
  
    @IsString()
    seguroMedico: string;
  
  }