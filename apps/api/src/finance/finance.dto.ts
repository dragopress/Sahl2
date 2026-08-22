import {IsDateString,IsIn,IsNumber,IsOptional,IsString,Min,ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
export class CreateAccountDto { @IsString() code!:string; @IsString() name!:string; @IsIn(['ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE']) type!:any; @IsOptional() @IsString() parentId?:string; }
export class CreateCashAccountDto { @IsString() name!:string; @IsIn(['BANK','CASH','MOBILE_WALLET']) type!:any; @IsOptional() @IsString() currency?:string; @IsOptional() @IsNumber() openingBalance?:number; @IsOptional() @IsString() accountId?:string; }
export class ManualJournalLineDto { @IsString() accountCode!:string; @IsNumber() @Min(0) debit!:number; @IsNumber() @Min(0) credit!:number; @IsOptional() @IsString() description?:string; }
export class ManualJournalDto { @IsDateString() entryDate!:string; @IsString() description!:string; @ValidateNested({each:true}) @Type(()=>ManualJournalLineDto) lines!:ManualJournalLineDto[]; }
export class CashTransactionDto { @IsString() cashAccountId!:string; @IsIn(['INCOME','EXPENSE','TRANSFER_IN','TRANSFER_OUT']) type!:any; @IsNumber() @Min(0.01) amount!:number; @IsOptional() @IsDateString() transactionDate?:string; @IsOptional() @IsString() description?:string; @IsOptional() @IsString() reference?:string; }
