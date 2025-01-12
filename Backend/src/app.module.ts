import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './Product/product.module';
import { OrderModule } from './Order/order.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
  // Import the middleware

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally for all modules
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // MongoDB URI from .env
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60h' }, // Adjusted token expiry time
      }),
      inject: [ConfigService],
    }),
    ProductModule, // Product-related functionality
    OrderModule,   // Order-related functionality
    AuthModule,    // Authentication-related functionality
  ],
  controllers: [AppController], // Main app controller
  providers: [AppService],      // Main app service
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()  // Apply the middleware globally
      .forRoutes('*');  // Apply globally, or specify routes if needed
  }
}
