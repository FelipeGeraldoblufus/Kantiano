import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @Transform(({value}) => value.trim()) //limpia caracteres en blanco
    @MinLength(6)
    password: string;

}
