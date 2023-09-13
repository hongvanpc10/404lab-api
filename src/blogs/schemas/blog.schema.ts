import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tag } from 'src/tags/schemas/tag.schema';
import { User } from 'src/users/schemas/user.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop()
  thumb: string;

  @Prop()
  content: string;

  @Prop({ unique: true, slug: 'title' })
  slug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }])
  tags: Tag[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
