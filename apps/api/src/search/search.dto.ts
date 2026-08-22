import {IsInt,IsOptional,IsString,Max,Min,MinLength} from 'class-validator';
import {Type} from 'class-transformer';
export class SearchDto {
 @IsString() @MinLength(2) q!: string;
 @IsOptional() @Type(()=>Number) @IsInt() @Min(1) page?: number;
 @IsOptional() @Type(()=>Number) @IsInt() @Min(1) @Max(50) pageSize?: number;
}
