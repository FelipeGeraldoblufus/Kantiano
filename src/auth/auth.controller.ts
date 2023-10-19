import { Body, Controller, Get, Post, UseGuards, Request, Patch, Param } from '@nestjs/common';
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
      const userId = req.user.id;
      // Utiliza directamente el userId para realizar la edición del perfil
      this.authService.editarPerfil(userId, editDto);
      // Puedes devolver una respuesta de éxito u otro resultado adecuado
      return { message: 'Perfil actualizado exitosamente' };
    }

    @Post("register")
    register(
        @Body()
        registerDto: RegisterDto
    ) {
        
        return this.authService.register(registerDto);
    }


    @Post("login")
    login(
        @Body()
        logindto: LoginDto, 

    ) {
        return this.authService.login(logindto);
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
        return this.authService.resetPassword(resetpassdto);
    }
  }



