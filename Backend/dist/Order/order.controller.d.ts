import { HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderController {
    private readonly orderService;
    private readonly logger;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto, req: any): Promise<{
        status: HttpStatus;
        message: string;
        order: import("./schema/order.schema").Order;
    }>;
    findAll(req: any): Promise<{
        status: HttpStatus;
        orders: import("./schema/order.schema").Order[];
    }>;
    findOne(id: string, req: any): Promise<{
        status: HttpStatus;
        order: import("./schema/order.schema").Order;
    }>;
    findAllForAdmin(): Promise<{
        status: HttpStatus;
        orders: import("./schema/order.schema").Order[];
    }>;
    markAsReceived(id: string, req: any): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    remove(id: string, req: any): Promise<{
        status: HttpStatus;
        message: string;
    }>;
}
