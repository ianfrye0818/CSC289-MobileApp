import { PartialType } from '@nestjs/swagger';
import { AddAddressRequestDto } from './AddAddressRequest.dto';

export class UpdateAddressRequestDto extends PartialType(
  AddAddressRequestDto,
) {}
