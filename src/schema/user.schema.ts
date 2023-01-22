import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ unique: true })
  phone?: string;
  @Prop()
  photoURL?: string;
  @Prop({ required: false, default: false })
  isConfirmed: boolean;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  posts?: [];
  @Prop({
    enum: ['user', 'admin', 'subscriber'],
    default: 'user',
    required: true,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
