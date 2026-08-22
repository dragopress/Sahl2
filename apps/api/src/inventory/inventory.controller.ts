import {Body,Controller,Get,Post,Query,Req,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';
import {TenantContextGuard} from '../common/tenant-context.guard';
import {Tenant} from '../common/tenant.decorator';
import {RequirePermission,RbacGuard} from '../common/rbac';
import {CreateWarehouseDto,StockAdjustmentDto,StockIssueDto,StockReceiptDto,StockTransferDto} from './inventory.dto';
import {InventoryService} from './inventory.service';

@Controller('inventory') @UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class InventoryController {
  constructor(private readonly service:InventoryService){}
  @Get('warehouses') @RequirePermission('inventory:read') warehouses(@Tenant() m:any){return this.service.warehouses(m.organizationId)}
  @Post('warehouses') @RequirePermission('inventory:write') createWarehouse(@Tenant() m:any,@Body() dto:CreateWarehouseDto,@Req() req:any){return this.service.createWarehouse(m.organizationId,req.auth.userId,dto,req)}
  @Get('stock') @RequirePermission('inventory:read') stock(@Tenant() m:any,@Query('warehouseId') warehouseId?:string){return this.service.stock(m.organizationId,warehouseId)}
  @Get('movements') @RequirePermission('inventory:read') movements(@Tenant() m:any,@Query('warehouseId') warehouseId?:string,@Query('productId') productId?:string,@Query('type') type?:string){return this.service.movements(m.organizationId,warehouseId,productId,type)}
  @Get('low-stock') @RequirePermission('inventory:read') lowStock(@Tenant() m:any){return this.service.lowStock(m.organizationId)}
  @Post('adjustments') @RequirePermission('inventory:write') adjust(@Tenant() m:any,@Body() dto:StockAdjustmentDto,@Req() req:any){return this.service.adjust(m.organizationId,req.auth.userId,dto,req)}
  @Post('receipts') @RequirePermission('inventory:write') receive(@Tenant() m:any,@Body() dto:StockReceiptDto,@Req() req:any){return this.service.receive(m.organizationId,req.auth.userId,dto,req)}
  @Post('issues') @RequirePermission('inventory:write') issue(@Tenant() m:any,@Body() dto:StockIssueDto,@Req() req:any){return this.service.issue(m.organizationId,req.auth.userId,dto,req)}
  @Post('transfers') @RequirePermission('inventory:write') transfer(@Tenant() m:any,@Body() dto:StockTransferDto,@Req() req:any){return this.service.transfer(m.organizationId,req.auth.userId,dto,req)}
}
