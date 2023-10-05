import { Transform } from "class-transformer";
import { IsEmail, IsNumber, IsString, MinLength, isInt } from "class-validator";

export class ResetPassDto{

    @IsNumber()
    id: number;
    
    
    @IsString()
    @Transform(({value}) => value.trim()) //limpia caracteres en blanco
    @MinLength(6)
    password: string;
    
    @IsString()
    @Transform(({value}) => value.trim()) //limpia caracteres en blanco
    @MinLength(6)
    newpassword: string;
}