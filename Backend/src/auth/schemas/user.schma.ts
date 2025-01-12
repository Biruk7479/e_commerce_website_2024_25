/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enums';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Email already exists.'] })
  email: string;

  @Prop()
  password: string;

 

  // Explicitly define _id to make it accessible
  readonly _id: string;
  @Prop({
    type:[{ type:String , enum:Role}],
    default:[Role.User]
})
role:Role[]

}

export const UserSchema = SchemaFactory.createForClass(User);
