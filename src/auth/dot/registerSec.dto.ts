import { IsString, IsEmail, MinLength } from 'class-validator';


export class RegisterSecretariaDto {
    @IsString()
    nombre: string;

    @IsString()
    apellido: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    direccion: string;
  
    // Atributos específicos de secretaria
    // Pueden ser añadidos en caso necesario
  }

