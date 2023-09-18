import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import UpdateUserDto from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updateUser(
    id: string,
    { avatar, bio, facebook, linkedin, name, website, github }: UpdateUserDto,
  ) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          avatar,
          bio,
          facebook,
          linkedin,
          name,
          website,
          github,
        },
        { new: true },
      )
      .select('-password');

    return user;
  }

  async getUserBySlug(slug: string) {
    const user = await this.userModel.findOne({ slug }).select('-password');
    if (!user) {
      throw new BadRequestException({ value: 'User not found' });
    }

    return user;
  }
}
