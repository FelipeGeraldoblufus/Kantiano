import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dot/register.dto';


import * as bcryptjs from "bcryptjs";
import { LoginDto } from './dot/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPassDto } from './dot/resetPass.dto';
import { EditDto } from './dot/editperfil.dto';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {
    //llama a los metodos del user
    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService
        
        
        
        ) {}




    /*async editarPerfil(userId: number, editDto: EditDto) {
    // Utiliza el userId y editDto para realizar la edición del perfil
    // Por ejemplo, puedes actualizar los campos del perfil según editDto
    const user = await this.usersService.findOneByID(userId);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Actualiza los campos del perfil según los datos proporcionados en editDto
    user.name = editDto.name;
    user.password = editDto.password;
    // Actualiza otros campos del perfil según sea necesario
    await this.usersService.updateUserProfile(user);
    }*/

    async generateToken(user: User) {
      const payload = { email: user.email, sub: user.id, name: user.name };
      return this.jwtService.sign(payload);
    }
    
    async editarPerfil(email: string, editDto: EditDto) {
      // Utiliza el email y editDto para realizar la edición del perfil
    
      const user = await this.usersService.findOneByEmail(email);
    
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
    
      // Verifica si la contraseña en editDto está encriptada
      const isPasswordHashed = await this.isPasswordHashed(editDto.password, user.password);
    
      // Si la contraseña no está encriptada, encripta la contraseña en editDto
      if (!isPasswordHashed) {
        const hashedPassword = await bcryptjs.hash(editDto.password, 10);
        editDto.password = hashedPassword;
      }
    
      // Actualiza los campos del perfil según los datos proporcionados en editDto
      user.name = editDto.name;
      user.password = editDto.password;
      user.rol = editDto.rol;
      // Actualiza otros campos del perfil según sea necesario
    
      await this.usersService.updateUserProfile(user);
    }
    
    private async isPasswordHashed(password: string, hashedPassword: string): Promise<boolean> {
      return await bcryptjs.compare(password, hashedPassword);
    } 

    async login({email, password}: LoginDto){

        const user = await this.usersService.findOneByEmail(email);
        if (!user){

            throw new UnauthorizedException("Email is wrong")

        }
        // Compara la contraseña proporcionada con la contraseña encriptada en la base de datos
        const passwordMatch = await bcryptjs.compare(password, user.password);

        if (!passwordMatch) {
          throw new UnauthorizedException('Password is wrong');
        }
        const payload = { id: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            email: user.email,
            name: user.name,

        };
    }

    async register({name, email, password, role}: RegisterDto){

        const user = await this.usersService.findOneByEmail(email);
        if (user){

            throw new BadRequestException("User already exists")

        }
        const hashedPassword = await bcryptjs.hash(password, 10);

        return await this.usersService.create({
            name, 
            email, 
            password: hashedPassword,
            rol: role
            
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
