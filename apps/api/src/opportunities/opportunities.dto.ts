import {IsDateString,IsInt,IsNumber,IsOptional,IsString,Max,Min} from 'class-validator';

export class CreateOpportunityDto {
  @IsString() title!: string;
  @IsOptional() @IsString() customerId?: string;
  @IsOptional() @IsString() stage?: string;
  @IsOptional() @IsNumber() @Min(0) value?: number;
  @IsOptional() @IsInt() @Min(0) @Max(100) probability?: number;
  @IsOptional() @IsDateString() expectedClose?: string;
  @IsOptional() @IsString() notes?: string;
}