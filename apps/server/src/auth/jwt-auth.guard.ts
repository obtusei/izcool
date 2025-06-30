import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    // console.log("AUTH GUARD TIRA")
    const result = (await super.canActivate(context)) as boolean;
    // const request = context.switchToHttp().getRequest();
    // await super.logIn(request);
    return result;
  }
}
