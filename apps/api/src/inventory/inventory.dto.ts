import {Type} from 'class-transformer';
import {IsDateString,IsIn,IsNumber,IsOptional,IsString,Min} from 'class-validator';

export class CreateWarehouseDto {
  @IsString() name!: string;
  @IsString() code!: string;
  @IsOptional() @Type(()=>Boolean) isDefault?: boolean;
}

export class StockAdjustmentDto {
  @IsString() warehouseId!: string;
  @IsString() productId!: string;
  @IsIn(['IN','OUT']) direction!: 'IN'|'OUT';
  @Type(()=>Number) @IsNumber({maxDecimalPlaces:3}) @Min(0.001) quantity!: number;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsDateString() occurredAt?: string;
}

export class StockReceiptDto {
  @IsString() warehouseId!: string;
  @IsString() productId!: string;
  @Type(()=>Number) @IsNumber({maxDecimalPlaces:3}) @Min(0.001) quantity!: number;
  @IsOptional() @IsString() sourceId?: string;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsDateString() occurredAt?: string;
}

export class StockIssueDto {
  @IsString() warehouseId!: string;
  @IsString() productId!: string;
  @Type(()=>Number) @IsNumber({maxDecimalPlaces:3}) @Min(0.001) quantity!: number;
  @IsOptional() @IsString() sourceId?: string;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsDateString() occurredAt?: string;
}

export class StockTransferDto {
  @IsString() fromWarehouseId!: string;
  @IsString() toWarehouseId!: string;
  @IsString() productId!: string;
  @Type(()=>Number) @IsNumber({maxDecimalPlaces:3}) @Min(0.001) quantity!: number;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsDateString() occurredAt?: string;
}
