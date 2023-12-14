import { IsInt, IsString, MinLength } from 'class-validator';

export class AddTeamProjectDto {
    
  @IsString()
  @MinLength(4)
  equipo: string;

  @IsString()
  projectName: string;

}