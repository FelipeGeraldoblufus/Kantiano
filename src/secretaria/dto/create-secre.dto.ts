import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateSecreDto {
    
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

    @IsString()
    @Transform(({ value }) => value.trim())
    apellido: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    direccion: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    tipoUsuario: string;
}