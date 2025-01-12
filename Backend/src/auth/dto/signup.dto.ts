/* eslint-disable prettier/prettier */
import {  IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    readonly name:string;

    @IsNotEmpty()
    @IsEmail() 
    readonly email:string;
 

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
    
    @IsOptional()
    readonly role:string[]
 
  // eslint-disable-next-line prettier/prettier
  
}