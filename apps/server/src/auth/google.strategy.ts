import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:4000/api/v1/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Here you'll typically find or create a user in your database
    const { id, name, emails, photos, provider } = profile;
    const lastName = name.familyName ? ' ' + name.familyName : '';
    const user = {
      providerId: id,
      email: emails[0].value,
      emailVerified: emails[0].verified,
      fullName: name.givenName + lastName,
      image: photos[0].value,
      provider: provider,
      accessToken,
      refreshToken,
    };
    const dbUser = await this.authService.validateUserGoogle(user);
    return user;
  }
}
