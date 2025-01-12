import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enums';
import { OrderState } from './schema/order.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    try {
      const userId = req.user.id; // Assuming you've added the userId to the JWT token

      createOrderDto.userId = userId; // Set the userId in the order

      const order = await this.orderService.create(createOrderDto);
      return {
        status: HttpStatus.CREATED,
        message: 'Order created successfully',
        order,
      };
    } catch (error) {
      this.logger.error('Error creating order:', error);
      throw new InternalServerErrorException(
        'Unable to create order. Please try again.'
      );
    }
  }

  @Get()
  async findAll(@Request() req) {
    try {
      const userId = req.user.id; // For users, get the userId from the token

      const orders = await this.orderService.findByUserId(userId); // Fetch only the user's orders
      return { status: HttpStatus.OK, orders };
    } catch (error) {
      this.logger.error('Error retrieving orders:', error);
      throw new InternalServerErrorException(
        'Unable to fetch orders. Please try again.'
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const userId = req.user.id;

      // Ensure that the order belongs to the user
      const order = await this.orderService.findOne(id);
      if (order.userId !== userId) {
        throw new NotFoundException('Order not found');
      }
      return { status: HttpStatus.OK, order };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error retrieving order with ID "${id}":`, error);
      throw new InternalServerErrorException(
        'Unable to fetch the order. Please try again.'
      );
    }
  }

 @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)// Assuming you have a role-based guard to check if the user is an admin
  async findAllForAdmin() {
    try {
      const orders = await this.orderService.findAll(); // Admin fetches all orders
      return { status: HttpStatus.OK, orders };
    } catch (error) {
      this.logger.error('Error retrieving orders:', error);
      throw new InternalServerErrorException(
        'Unable to fetch orders. Please try again.'
      );
    }
  }

  @Patch(':id/received')
  async markAsReceived(@Param('id') id: string, @Request() req) {
    try {
      const userId = req.user.id; // Get user ID from token
      const order = await this.orderService.findOne(id);

      if (order.userId !== userId) {
        throw new NotFoundException('Order not found');
      }

      // Update the order's status to "received"
      order.state = OrderState.COMPLETED;
      await this.orderService.update(id, order); // Update the order status in the DB

      return { status: HttpStatus.OK, message: 'Order marked as received' };
    } catch (error) {
      this.logger.error('Error marking order as received:', error);
      throw new InternalServerErrorException(
        'Unable to mark order as received. Please try again.'
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const userId = req.user.id; // Get user ID from token
      const order = await this.orderService.findOne(id);

      if (order.userId !== userId) {
        throw new NotFoundException('Order not found');
      }

      // Delete the order from the DB
      await this.orderService.remove(id);

      return { status: HttpStatus.OK, message: 'Order deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting order:', error);
      throw new InternalServerErrorException(
        'Unable to delete order. Please try again.'
      );
    }
  }
}
