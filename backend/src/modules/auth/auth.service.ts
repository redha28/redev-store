import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, fullName, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      fullName,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Remove password from response
    const { password: _, ...result } = user;
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m', // Access token expires in 15 minutes
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token expires in 7 days
      secret: this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'your-refresh-secret-key',
      ),
    });

    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async refreshTokens(user: any) {
    const payload = { email: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    return {
      access_token,
    };
  }

  async validateRefreshToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_SECRET',
          'your-refresh-secret-key',
        ),
      });

      const user = await this.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
