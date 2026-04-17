import { GetCustomerByEmailQuery } from '@/features/customers/queries/GetCustomerByEmail/GetCustomerByEmailQuery';
import { Customer } from '@generated/prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { TokenResponse } from '../../types/TokenResponse';
import { LoginUserCommand } from './LoginUserCommand';

/**
 * Handles `LoginUserCommand` — looks up a customer by email and issues a JWT.
 *
 * **Note on authentication model:** This project uses email-only login (no
 * password). In a production app you would verify a password hash here before
 * calling `generateToken`.
 *
 * Steps:
 * 1. Dispatch `GetCustomerByEmailQuery` via the `QueryBus` to find the customer.
 * 2. Throw `NotFoundException` if no customer exists with that email.
 * 3. Sign a JWT with the customer's ID (`sub`), email, and full name as claims.
 * 4. Return the signed token string — the controller sends it back to the client.
 */
@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginUserCommand): Promise<TokenResponse> {
    const { email } = command.dto;
    const customer = await this.queryBus.execute(
      new GetCustomerByEmailQuery(email),
    );
    if (!customer) throw new NotFoundException('Customer not found');

    return await this.generateToken(customer);
  }

  /**
   * Signs a JWT containing the customer's core identity claims.
   * `sub` (subject) is the standard JWT claim for the user ID.
   * Token expiry is configured in `AuthModule` (`JwtModule.register`).
   */
  private async generateToken(customer: Customer) {
    const payload = {
      sub: customer.Customer_ID,
      email: customer.Email,
      name: `${customer.First_Name} ${customer.Last_Name}`,
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
