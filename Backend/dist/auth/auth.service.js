"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schma_1 = require("./schemas/user.schma");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(useModel, jwtService) {
        this.useModel = useModel;
        this.jwtService = jwtService;
        this.tokenBlacklist = new Set();
    }
    async signUp(signUpDto) {
        const { name, email, password, role } = signUpDto;
        const existingUser = await this.useModel.findOne({ email });
        if (existingUser) {
            throw new common_1.HttpException('Email already in use', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.useModel.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });
        const token = this.jwtService.sign({ id: user._id, role: user.role }, { expiresIn: '1d' });
        return { token };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.useModel.findOne({ email });
        if (!user) {
            throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = this.jwtService.sign({ id: user._id, role: user.role }, { expiresIn: '7d' });
        return { token };
    }
    async logout(token) {
        this.tokenBlacklist.add(token);
        return { message: 'Successfully logged out' };
    }
    async isTokenBlacklisted(token) {
        return this.tokenBlacklist.has(token);
    }
    async validateToken(token) {
        const isBlacklisted = await this.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new common_1.HttpException('Token is invalidated', common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            this.jwtService.verify(token);
            return true;
        }
        catch (error) {
            throw new common_1.HttpException('Invalid token', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schma_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map