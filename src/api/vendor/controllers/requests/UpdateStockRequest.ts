

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export interface ProductStock {
    skuId?: number;
    outOfStockThreshold?: number;
    notifyMinQuantity?: number;
    minQuantityAllowedCart?: number;
    maxQuantityAllowedCart?: number;
    enableBackOrders?: number;
    backOrderStockLimit?: number;
}

export class UpdateStockRequest {

    @IsNotEmpty()
    public productId: number;
    public hasStock: number;
    public productStock: ProductStock[];
}
