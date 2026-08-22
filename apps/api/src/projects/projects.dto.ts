import {IsDateString,IsIn,IsNumber,IsOptional,IsString,Min} from 'class-validator';

export class CreateProjectDto {
 @IsString() name!: string;
 @IsOptional() @IsString() customerId?: string;
 @IsOptional() @IsNumber({maxDecimalPlaces:2}) @Min(0) budget?: number;
 @IsOptional() @IsString() status?: string;
}
export class UpdateProjectDto {
 @IsOptional() @IsString() name?: string;
 @IsOptional() @IsString() customerId?: string;
 @IsOptional() @IsNumber({maxDecimalPlaces:2}) @Min(0) budget?: number;
 @IsOptional() @IsString() status?: string;
}
export class CreateTaskDto {
 @IsString() title!: string;
 @IsOptional() @IsString() projectId?: string;
 @IsOptional() @IsIn(['TODO','IN_PROGRESS','DONE','BLOCKED']) status?: string;
 @IsOptional() @IsDateString() dueAt?: string;
 @IsOptional() @IsString() assigneeId?: string;
}
export class UpdateTaskDto {
 @IsOptional() @IsString() title?: string;
 @IsOptional() @IsIn(['TODO','IN_PROGRESS','DONE','BLOCKED']) status?: string;
 @IsOptional() @IsDateString() dueAt?: string;
 @IsOptional() @IsString() assigneeId?: string;
 @IsOptional() @IsString() projectId?: string;
}
