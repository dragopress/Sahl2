import {Type} from 'class-transformer';
import {IsArray,IsDateString,IsEmail,IsNumber,IsOptional,IsString,Max,Min,ValidateNested} from 'class-validator';
export class QuoteItemDto{
 @IsString() @IsOptional() productId?:string;
 @IsString() description!:string;
 @Type(()=>Number) @IsNumber({maxDecimalPlaces:3}) @Min(0.001) quantity!:number;
 @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) unitPrice!:number;
 @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) @Max(100) @IsOptional() taxRate?:number;
}
export class CreateQuoteDto{
 @IsString() customerId!:string;
 @IsString() @IsOptional() projectId?:string;
 @IsArray() @ValidateNested({each:true}) @Type(()=>QuoteItemDto) items!:QuoteItemDto[];
 @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) @IsOptional() discount?:number;
 @IsDateString() @IsOptional() validUntil?:string;
 @IsString() @IsOptional() notes?:string;
}
export class CreateInvoiceDto{
 @IsString() customerId!:string;
 @IsString() @IsOptional() quoteId?:string;
 @IsString() @IsOptional() projectId?:string;
 @IsString() @IsOptional() warehouseId?:string;
 @IsArray() @ValidateNested({each:true}) @Type(()=>QuoteItemDto) items!:QuoteItemDto[];
 @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) @IsOptional() discount?:number;
 @IsDateString() @IsOptional() dueAt?:string;
 @IsDateString() @IsOptional() issuedAt?:string;
 @IsString() @IsOptional() notes?:string;
}
export class CreatePaymentDto{
 @IsString() invoiceId!:string;
 @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0.01) amount!:number;
 @IsDateString() @IsOptional() paidAt?:string;
 @IsString() @IsOptional() method?:string;
 @IsString() @IsOptional() reference?:string;
}
