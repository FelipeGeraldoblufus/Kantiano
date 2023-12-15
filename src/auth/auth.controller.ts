import { Body, Controller, Get, Post, UseGuards, Request, Patch, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dot/register.dto';
import { LoginDto } from './dot/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { ResetPassDto } from './dot/resetPass.dto';
import { EditDto } from './dot/editperfil.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService
        
        ) {}


    @Patch('editarperfil')
    @UseGuards(AuthGuard)
    editarPerfil(@Request() req, @Body() editDto: EditDto) {
    const userEmail = req.user.email; // Obtén el email del usuario autenticado desde el token
    console.log('Usuario autenticado:', req.user.email);
    // Busca al usuario por email en lugar de ID
    try{
        this.authService.editarPerfil(userEmail, editDto);

        return { message: 'Perfil actualizado exitosamente' };
    }catch (error) {
        throw new NotFoundException(`No se pudieron editar el perfil del usuario`);
      }
    }
    


    @Post("register")
    register(
        @Body()
        registerDto: RegisterDto
    ) {
        
        try{return this.authService.register(registerDto);
        }catch (error) {
            throw new NotFoundException(`No se pudieron registrar el usuario`);
          }
    }


    @Post("login")
    login(
        @Body()
        logindto: LoginDto, 

    ) {
        try{
            return this.authService.login(logindto);

        }catch (error) {
            throw new NotFoundException(`Fallo al inicio de sesion`);
          }
    }

    @Get("profile")
    @UseGuards(AuthGuard)
    profile(
        @Request() req,

    ){
        return req.user;
    }


    @Patch('resetpassword')
    resetpassword(
        @Body()
        resetpassdto :ResetPassDto,
    ) {
        try{return this.authService.resetPassword(resetpassdto);
        }catch (error) {
            throw new NotFoundException(`Fallo al restaurar contraseña`);
          }
    }
  }



