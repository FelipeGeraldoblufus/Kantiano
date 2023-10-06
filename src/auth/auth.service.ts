import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dot/register.dto';


import * as bcryptjs from "bcryptjs";
import { LoginDto } from './dot/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPassDto } from './dot/resetPass.dto';



@Injectable()
export class AuthService {
    //llama a los metodos del user
    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService
        
        
        
        ) {}


    async login({email, password}: LoginDto){

        const user = await this.usersService.findOneByEmail(email);
        if (!user){

            throw new UnauthorizedException("Email is wrong")

        }
        const userpass = await this.usersService.findOneByID(user.id)
        
        if (userpass.password !==  password){

            throw new UnauthorizedException("Password is wrong")

        }

        const payload = { email: user.email };

        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            email,

        };
    }

    async register({name, email, password}: RegisterDto){

        const user = await this.usersService.findOneByEmail(email);
        if (user){

            throw new BadRequestException("User already exists")

        }

        return await this.usersService.create({
            name, 
            email, 
            password
        });
    }


    /*async resetPassword({password, newpassword}: ResetPassDto): Promise<void> {
    
        // Verifica la contraseña temporal proporcionada utilizando el método findOneByPass del UsersService
        const user = await this.usersService.findOneByPass(password);
    
        if (!user) {
          throw new BadRequestException('Contraseña temporal incorrecta');
        }
    
        // Actualiza el campo de contraseña con la nueva contraseña sin encriptar
        user.password = newpassword;
        
        try {
          await this.usersService.resetPassword(newpassword);
        } catch (error) {
          // Maneja cualquier error que pueda ocurrir durante la actualización de contraseña
          throw new BadRequestException('Error al actualizar la contraseña');
        }

      }*/

      async resetPassword({email}: ResetPassDto) {
        // Verifica la contraseña antigua proporcionada utilizando el método findOneByPass del UsersService
        const user = await this.usersService.findOneByEmail(email);
      
        if (!user) {
          throw new BadRequestException('Email incorrecto');
        }
      
        // Utiliza el método del UsersService para actualizar la contraseña
        try {
          await this.usersService.updatePassword(email);
        } catch (error) {
          // Maneja cualquier error que pueda ocurrir durante la actualización de contraseña
          throw new BadRequestException('Error al actualizar la contraseña');
        }
      }
    
      


}
