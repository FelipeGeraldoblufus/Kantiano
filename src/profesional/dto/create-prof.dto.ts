import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateProfDto {
    
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    nombre: string;

    @IsEmail()
    email: string;

    @IsString()
    @Transform(({ value }) => value.trim()) // Limpia caracteres en blanco
    @MinLength(6)
    password: string;

    @Transform(({ value }) => value.trim())
    apellido: string;

    @Transform(({ value }) => value.trim())
    especialidad: string;

    @Transform(({ value }) => value.trim())
    tipoUsuario: string;
}