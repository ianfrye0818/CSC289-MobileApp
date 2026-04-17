import { Public } from '@/decorators/Public.decorator';
import { User } from '@/decorators/User.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  LoginUserCommand,
  LoginUserCommandRequestDto,
} from './commands/LoginUser/LoginUserCommand';
import {
  RegisterUserCommand,
  RegisterUserCommandRequestDto,
} from './commands/RegisterUser/RegisterUserCommand';
import { AuthUserDto } from './types/AuthUserDto.type';
import { TokenResponse } from './types/TokenResponse';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('me')
  @ApiOperation({ summary: 'Get User Info' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: AuthUserDto, description: 'User Info' })
  async me(@User() user: AuthUserDto): Promise<AuthUserDto> {
    return user;
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login User' })
  @ApiBody({ type: LoginUserCommandRequestDto, required: true })
  @ApiOkResponse({ type: TokenResponse })
  async login(
    @Body() body: LoginUserCommandRequestDto,
  ): Promise<TokenResponse> {
    return this.commandBus.execute(new LoginUserCommand(body));
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register User' })
  @ApiOkResponse({ type: TokenResponse })
  async register(
    @Body() body: RegisterUserCommandRequestDto,
  ): Promise<TokenResponse> {
    return this.commandBus.execute(new RegisterUserCommand(body));
  }
}
