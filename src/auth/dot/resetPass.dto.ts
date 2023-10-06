import { Transform } from "class-transformer";
import { IsEmail, IsNumber, IsString, MinLength, isInt } from "class-validator";

export class ResetPassDto{

   
 
    @IsEmail()
    email: string;
    
   
}