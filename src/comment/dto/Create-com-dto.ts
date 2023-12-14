import { IsString, MinLength } from 'class-validator';

export class CreateComDto {
    
  @IsString()
  @MinLength(4)
  Tarea: string;
  
  @IsString()
  Comentario: string

}