import {IsEmail,IsOptional,IsString,Length,MinLength} from 'class-validator';
export class RegisterDto{@IsEmail() email!:string;@IsString() @MinLength(2) @Length(2,120) name!:string;@IsString() @MinLength(12) password!:string;@IsString() @MinLength(2) organizationName!:string}
export class LoginDto{@IsEmail() email!:string;@IsString() @MinLength(1) password!:string}
