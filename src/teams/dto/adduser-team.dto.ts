import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from "class-transformer";

export class AddUserTeamDto {
    
  
  @IsEmail()
  email: string;

}