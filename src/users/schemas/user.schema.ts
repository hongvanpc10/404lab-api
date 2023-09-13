import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Role from 'src/roles/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ slug: 'name', unique: true })
  slug: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  facebook: string;

  @Prop({ default: '' })
  linkedin: string;

  @Prop({ default: '' })
  github: string;

  @Prop({ default: '' })
  website: string;

  @Prop({ default: [Role.User] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
