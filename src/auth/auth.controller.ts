import { Body, Controller, Get, Post, UseGuards, Request, Patch, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dot/register.dto';
import { LoginDto } from './dot/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { ResetPassDto } from './dot/resetPass.dto';
import { EditDto } from './dot/editperfil.dto';
import { RegisterProfesionalDto } from './dot/registerMed.dto';
import { RegisterSecretariaDto } from './dot/registerSec.dto';
import { EditProfesionalDto } from './dot/editprof.dto';
import { EditSecretariaDTO } from './dot/editsecre.dto';

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

    @Patch('editarperfil/profesional')
    @UseGuards(AuthGuard)
    async editarPerfilProf(@Request() req, @Body() editDto: EditProfesionalDto) {
      const userEmail = req.user.email; // Email del usuario autenticado
      const userRole = req.user.tipoUsuario; // Tipo de usuario autenticado
  
      console.log('Usuario autenticado:', userEmail, 'Tipo de usuario:', userRole);
  
      if (userRole === 'secretaria' || req.user.email === userEmail) {
        try {
          await this.authService.editarPerfilProf(userEmail, editDto);
          return { message: 'Perfil actualizado exitosamente' };
        } catch (error) {
          throw new BadRequestException(`No se pudo editar el perfil del profesional: ${error.message}`);
        }
      } else {
        throw new NotFoundException('No tienes permiso para editar este perfil');
      }
    }

    @Patch('editarperfil/secretaria')
  @UseGuards(AuthGuard)
  async editarPerfilSecre(@Request() req, @Body() editDto: EditSecretariaDTO) {
    const userEmail = req.user.email; // Email del usuario autenticado
    console.log('Usuario autenticado:', userEmail);

    try {
      await this.authService.editarPerfilSecre(userEmail, editDto);
      return { message: 'Perfil actualizado exitosamente' };
    } catch (error) {
      throw new NotFoundException(`No se pudo editar el perfil de la secretaria: ${error.message}`);
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

    @Post("Mregister")
    registerM(
        @Body()
        registerDto: RegisterProfesionalDto
    ) {
        
        try{return this.authService.registerProfesional(registerDto);
        }catch (error) {
            throw new NotFoundException(`No se pudieron registrar el usuario`);
          }
    }

    @Post("Sregister")
    registerS(
        @Body()
        registerDto: RegisterSecretariaDto
    ) {
        
        try{return this.authService.registerSecretaria(registerDto);
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

    @Post("Dlogin")
    dlogin(
        @Body()
        logindto: LoginDto, 

    ) {
        try{
            return this.authService.logindinamico(logindto);

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



