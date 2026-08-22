import {IsEmail,IsEnum,IsOptional,IsString,MaxLength} from 'class-validator';
import {CustomerType} from '@prisma/client';
export class CreateCustomerDto{
 @IsString() @MaxLength(160) name!:string;
 @IsOptional() @IsEnum(CustomerType) type?:CustomerType;
 @IsOptional() @IsEmail() email?:string;
 @IsOptional() @IsString() @MaxLength(40) phone?:string;
 @IsOptional() @IsString() @MaxLength(120) ice?:string;
}
