import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';
import { UpdateCustomerRequestDto } from '../models/UpdateCustomerRequest.dto';
 
export class UpdateCustomerCommand extends Command<UpdatedMessageResponse> {
  constructor(
    public readonly customerId: number,
    public readonly dto: UpdateCustomerRequestDto,
    public readonly userId: number,
  ) {
    super();
  }
}
 