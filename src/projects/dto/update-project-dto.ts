import { Transform } from "class-transformer";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProjectDto  {

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  descripcion: string;

}