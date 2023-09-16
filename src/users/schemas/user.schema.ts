import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Role from 'src/roles/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: '', trim: true })
  bio: string;

  @Prop({ slug: 'name', unique: true })
  slug: string;

  @Prop({ default: '', trim: true })
  avatar: string;

  @Prop({ default: '', trim: true })
  facebook: string;

  @Prop({ default: '', trim: true })
  linkedin: string;

  @Prop({ default: '', trim: true })
  github: string;

  @Prop({ default: '', trim: true })
  website: string;

  @Prop({ default: [Role.User] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
