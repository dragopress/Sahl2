import {IsDateString,IsEnum,IsNumber,IsOptional,IsString,Max,Min} from 'class-validator';
export class CreateExpenseDto {
 @IsString() category!:string;
 @IsNumber() @Min(0.01) amount!:number;
 @IsOptional() @IsNumber() @Min(0) @Max(100) taxRate?:number;
 @IsDateString() incurredAt!:string;
 @IsOptional() @IsString() description?:string;
 @IsOptional() @IsString() accountCode?:string;
 @IsOptional() @IsString() supplierId?:string;
 @IsOptional() @IsString() employeeId?:string;
 @IsOptional() @IsString() projectId?:string;
 @IsOptional() @IsString() attachmentUrl?:string;
 @IsOptional() @IsEnum(['CASH','BANK','CARD','MOBILE_WALLET','OTHER'] as const) paymentMethod?:any;
}
export class PayExpenseDto { @IsString() cashAccountId!:string; @IsOptional() @IsDateString() paidAt?:string; @IsOptional() @IsString() reference?:string; }
