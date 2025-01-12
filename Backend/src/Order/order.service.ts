import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument, OrderState } from './schema/order.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {}

  // Create a new order
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return await createdOrder.save();
  }

  // Find all orders for a specific user (by userId)
  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId })
      .populate('products.productId') // Populate product details (e.g., title, price)
      .exec(); // Fetch orders for the logged-in user
  }

  // Find all orders (for admin)
  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('products.productId') // Populate product details (e.g., title, price)
      .exec(); // Admin can access all orders
  }

  // Find a single order by its ID
  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('products.productId') // Populate product details
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  // Update an order (if needed)
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  // Delete an order
  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();

    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return deletedOrder;
  }
}
