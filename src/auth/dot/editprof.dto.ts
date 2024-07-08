import { IsOptional, IsString, MinLength } from 'class-validator';


export class EditProfesionalDto{
    @IsOptional()
    @IsString()
    @MinLength(1)
    nombre?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    apellido?: string;

    @IsOptional()
    @IsString()
    especialidad?: string;

    @IsOptional()
    @IsString()
    tipoUsuario?: string;

    @IsOptional()
    @IsString()
    password?: string;
}