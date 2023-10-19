import { IsEmail, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";


export class EditDto{


    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    name: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    password: string;


}