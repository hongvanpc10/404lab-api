import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import SignInDto from './dto/signIn.dto';
import SignUpDto from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp({ email, name, password }: SignUpDto) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException({
        message: 'Email already exists',
        code: 1000,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      name,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random&size=256&length=1&bold=true&font-size=.6&color=fff`,
    });

    await newUser.save();

    return { email };
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException({
        value: 'User not found',
        code: 1100,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException({
        value: 'Password is wrong',
        code: 1101,
      });
    }

    const accessToken = this.jwtService.sign(
      { id: user._id, roles: user.roles },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '1h' },
    );
    const refreshToken = this.jwtService.sign(
      { id: user._id },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '30d' },
    );

    user.password = null;

    return { accessToken, refreshToken, user };
  }

  async refreshToken(_refreshToken: string) {
    if (!_refreshToken) {
      throw new UnauthorizedException({
        value: 'User not singed in',
        code: 1300,
      });
    }

    const { id } = this.jwtService.verify<{ id: string }>(_refreshToken, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const user = await this.userModel.findById(id).select('-password -email');

    const accessToken = this.jwtService.sign(
      { id, roles: user.roles },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '1h' },
    );

    return { accessToken, user };
  }
}
