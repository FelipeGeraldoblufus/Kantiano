import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { EditProfesionalDto } from 'src/auth/dot/editprof.dto';

export class UpdateProfesionalDto extends PartialType(EditProfesionalDto) {
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
}