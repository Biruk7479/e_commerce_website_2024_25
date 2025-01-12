/* eslint-disable prettier/prettier */
import {  IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

  // eslint-disable-next-line prettier/prettier
  
// eslint-disable-next-line prettier/prettier
}