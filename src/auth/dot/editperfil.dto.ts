import { IsEmail, IsInt, IsOptional, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";


export class EditDto{


    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    nombre?: string;

    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    apellido?: string;

    @IsOptional()
    @IsInt()
    edad?: number;

    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    direccion?: string;

    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    rut?: string;

    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    seguroMedico?: string;

    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsString()
    tipoUsuario?: string;
}



