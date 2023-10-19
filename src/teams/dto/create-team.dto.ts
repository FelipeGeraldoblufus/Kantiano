import { Transform } from "class-transformer";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateTeamDto {

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(4)
    name: string;

    @IsString()
    @IsOptional() // Hace que la propiedad sea opcional
    descripcion?: string;

}