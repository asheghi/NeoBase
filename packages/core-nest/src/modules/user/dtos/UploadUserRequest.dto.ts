import { ApiProperty } from '@nestjs/swagger';

export class UploadUserRequest {
  @ApiProperty()
  roles: string[];
}
