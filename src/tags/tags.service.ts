import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from './schemas/tag.schema';
import { Model } from 'mongoose';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  async createTag(name: string) {
    const tag = new this.tagModel({ name });
    await tag.save();
    return tag;
  }

  getAllTags() {
    return this.tagModel.find().sort({ name: 1 });
  }
}
