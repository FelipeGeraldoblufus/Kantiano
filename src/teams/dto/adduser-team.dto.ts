import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from "class-transformer";

export class AddUserTeamDto {
    
  @Transform(({value}) => value.trim())
  @IsString()
  teamName: string;
  
  @IsEmail()
  email: string;




}