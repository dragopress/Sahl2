import {IsDateString,IsNumber,IsOptional,IsString,Min} from 'class-validator';
export class ImportBankLineDto { @IsString() cashAccountId!: string; @IsOptional() @IsString() externalId?: string; @IsDateString() transactionDate!: string; @IsOptional() @IsString() description?: string; @IsOptional() @IsString() reference?: string; @IsNumber() amount!: number; @IsString() direction!: 'CREDIT'|'DEBIT'; }
export class MatchBankLineDto { @IsString() cashTransactionId!: string; }
