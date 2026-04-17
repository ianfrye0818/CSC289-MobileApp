import { MembershipLevel } from '@/features/customers/models/MembershipLevel.enum';
import { PrismaService } from '@/services/Prisma.service';
import { Customer } from '@generated/prisma/client';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../../types/Payload';
import { TokenResponse } from '../../types/TokenResponse';
import { RegisterUserCommand } from './RegisterUserCommand';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<TokenResponse> {
    const { email, firstName, lastName, phone } = command.dto;

    const existingUser = await this.prisma.customer.findUnique({
      where: {
        Email: email,
      },
    });

    if (existingUser) {
      // Login the user and return the token
      const payload = this.generatePayload(existingUser);
      return { accessToken: await this.jwtService.signAsync(payload) };
    }

    const customer = await this.prisma.customer.create({
      data: {
        Email: email,
        First_Name: firstName,
        Last_Name: lastName,
        Phone: phone,
        member: {
          connect: {
            Membership_Level: MembershipLevel.BRONZE,
          },
        },
      },
    });

    const payload = this.generatePayload(customer);

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  generatePayload(customer: Customer): Payload {
    return {
      sub: customer.Customer_ID,
      email: customer.Email,
      name: `${customer.First_Name} ${customer.Last_Name}`,
    };
  }
}
