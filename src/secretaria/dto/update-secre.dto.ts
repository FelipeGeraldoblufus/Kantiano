import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { EditSecretariaDTO } from 'src/auth/dot/editsecre.dto';


export class UpdateSecretariaDto extends PartialType(EditSecretariaDTO) {
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
    @MinLength(1)
    direccion?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
    
    @IsOptional()
    @IsString()
    tipoUsuario?: string;
}