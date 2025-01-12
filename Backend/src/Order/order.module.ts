import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './schema/order.schema';
import { AuthModule } from '../auth/auth.module'; // Import the AuthModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    AuthModule, // Ensure AuthModule is imported
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
