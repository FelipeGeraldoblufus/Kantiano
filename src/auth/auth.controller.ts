import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dot/register.dto';
import { LoginDto } from './dot/login.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}


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


}
