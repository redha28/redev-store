import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Response,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login user - returns HttpOnly cookies' })
  @ApiResponse({ status: 200, description: 'Login successful, cookies set' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Response() res: ExpressResponse,
    @Body() loginDto: LoginDto,
  ) {
    const tokens = await this.authService.login(req.user);

    // Set access token cookie (15 minutes)
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token cookie (7 days)
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      message: 'Login successful',
      user: tokens.user,
    });
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    const { password, ...userWithoutPassword } = req.user;
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: userWithoutPassword,
    };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req, @Response() res: ExpressResponse) {
    const tokens = await this.authService.refreshTokens(req.user);

    // Set new access token cookie
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.json({
      message: 'Token refreshed successfully',
    });
  }

  @ApiOperation({ summary: 'Logout user - clears cookies' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Post('logout')
  async logout(@Response() res: ExpressResponse) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.json({
      message: 'Logout successful',
    });
  }
}
