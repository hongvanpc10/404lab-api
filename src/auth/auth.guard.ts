import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Role from 'src/roles/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException({
        value: 'User not signed in',
        code: 1400,
      });
    }

    try {
      const { id, roles } = this.jwtService.verify<{
        id: string;
        roles: Role[];
      }>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      request['user'] = { id, roles };
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException({
          value: 'Token expired',
          code: 1401,
        });
      } else if (error.message === 'jwt malformed') {
        throw new UnauthorizedException({
          value: 'Token malformed',
          code: 1402,
        });
      } else {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
