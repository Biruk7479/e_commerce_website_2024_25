import { User } from './schemas/user.schma';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private useModel;
    private jwtService;
    private tokenBlacklist;
    constructor(useModel: Model<User>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    logout(token: string): Promise<{
        message: string;
    }>;
    isTokenBlacklisted(token: string): Promise<boolean>;
    validateToken(token: string): Promise<boolean>;
}
