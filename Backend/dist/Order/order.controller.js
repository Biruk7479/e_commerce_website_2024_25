"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrderController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enums_1 = require("../auth/enums/role.enums");
const order_schema_1 = require("./schema/order.schema");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let OrderController = OrderController_1 = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        this.logger = new common_1.Logger(OrderController_1.name);
    }
    async create(createOrderDto, req) {
        try {
            const userId = req.user.id;
            createOrderDto.userId = userId;
            const order = await this.orderService.create(createOrderDto);
            return {
                status: common_1.HttpStatus.CREATED,
                message: 'Order created successfully',
                order,
            };
        }
        catch (error) {
            this.logger.error('Error creating order:', error);
            throw new common_1.InternalServerErrorException('Unable to create order. Please try again.');
        }
    }
    async findAll(req) {
        try {
            const userId = req.user.id;
            const orders = await this.orderService.findByUserId(userId);
            return { status: common_1.HttpStatus.OK, orders };
        }
        catch (error) {
            this.logger.error('Error retrieving orders:', error);
            throw new common_1.InternalServerErrorException('Unable to fetch orders. Please try again.');
        }
    }
    async findOne(id, req) {
        try {
            const userId = req.user.id;
            const order = await this.orderService.findOne(id);
            if (order.userId !== userId) {
                throw new common_1.NotFoundException('Order not found');
            }
            return { status: common_1.HttpStatus.OK, order };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error retrieving order with ID "${id}":`, error);
            throw new common_1.InternalServerErrorException('Unable to fetch the order. Please try again.');
        }
    }
    async findAllForAdmin() {
        try {
            const orders = await this.orderService.findAll();
            return { status: common_1.HttpStatus.OK, orders };
        }
        catch (error) {
            this.logger.error('Error retrieving orders:', error);
            throw new common_1.InternalServerErrorException('Unable to fetch orders. Please try again.');
        }
    }
    async markAsReceived(id, req) {
        try {
            const userId = req.user.id;
            const order = await this.orderService.findOne(id);
            if (order.userId !== userId) {
                throw new common_1.NotFoundException('Order not found');
            }
            order.state = order_schema_1.OrderState.COMPLETED;
            await this.orderService.update(id, order);
            return { status: common_1.HttpStatus.OK, message: 'Order marked as received' };
        }
        catch (error) {
            this.logger.error('Error marking order as received:', error);
            throw new common_1.InternalServerErrorException('Unable to mark order as received. Please try again.');
        }
    }
    async remove(id, req) {
        try {
            const userId = req.user.id;
            const order = await this.orderService.findOne(id);
            if (order.userId !== userId) {
                throw new common_1.NotFoundException('Order not found');
            }
            await this.orderService.remove(id);
            return { status: common_1.HttpStatus.OK, message: 'Order deleted successfully' };
        }
        catch (error) {
            this.logger.error('Error deleting order:', error);
            throw new common_1.InternalServerErrorException('Unable to delete order. Please try again.');
        }
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enums_1.Role.Admin),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAllForAdmin", null);
__decorate([
    (0, common_1.Patch)(':id/received'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "markAsReceived", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "remove", null);
exports.OrderController = OrderController = OrderController_1 = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map