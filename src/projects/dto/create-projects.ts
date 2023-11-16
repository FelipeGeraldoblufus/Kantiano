import { Exclude, Transform } from "class-transformer";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateProjectDto {

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  @IsOptional()
  @Exclude() // Excluye esta propiedad al serializar
  descripcion?: string;

}