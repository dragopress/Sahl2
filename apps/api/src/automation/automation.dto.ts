import {IsBoolean,IsEnum,IsObject,IsOptional,IsString,MinLength} from 'class-validator';
export enum AutomationRuleTypeDto { OVERDUE_INVOICES='OVERDUE_INVOICES', LOW_STOCK='LOW_STOCK', TASK_DEADLINES='TASK_DEADLINES', EXPENSE_APPROVAL='EXPENSE_APPROVAL', CASHFLOW_RISK='CASHFLOW_RISK' }
export class CreateAutomationRuleDto { @IsString() @MinLength(2) name!: string; @IsEnum(AutomationRuleTypeDto) type!: AutomationRuleTypeDto; @IsOptional() @IsBoolean() enabled?: boolean; @IsOptional() @IsObject() config?: Record<string,unknown>; }
