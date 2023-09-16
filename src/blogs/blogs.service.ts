import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateBlogDto from './dto/createBlog.dto';
import { Blog } from './schemas/blog.schema';
import UpdateBlogDto from './dto/updateBlog.dto';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(
    authorId: string,
    { content, thumb, title, description, tags }: CreateBlogDto,
  ) {
    const blog = new this.blogModel({
      title,
      content,
      description,
      thumb,
      author: authorId,
      tags,
    });
    await blog.save();

    return { slug: blog.slug };
  }

  async updateBlog(
    id: string,
    user,
    { content, tags, thumb, title, description }: UpdateBlogDto,
  ) {
    const { slug, author } = await this.blogModel
      .findByIdAndUpdate(
        id,
        { content, tags, thumb, title, description },
        { new: true },
      )
      .select('slug author');

    if (!user.roles.includes('admin') && author !== user.id) {
      throw new UnauthorizedException({
        value: 'User is not accepted',
        code: 2001,
      });
    }

    return { slug };
  }

  async deleteBlog(id: string, user) {
    const { author } = await this.blogModel.findById(id).select('author');

    if (!user.roles.includes('admin') && author !== user.id) {
      throw new UnauthorizedException({
        value: 'User is not accepted',
        code: 2001,
      });
    }

    await this.blogModel.findByIdAndDelete(id);
  }

  async getBlog(slug: string) {
    const blog = await this.blogModel
      .findOne({ slug })
      .populate('author tags', '-password -email -roles');
    if (!blog) {
      throw new NotFoundException({ value: 'Blog not found', code: 2000 });
    }

    return blog;
  }
}
