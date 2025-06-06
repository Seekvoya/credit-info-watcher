import { HttpException, HttpStatus } from '@nestjs/common';

export const dataCheck = (data) => {
  if (!data) {
    throw new HttpException(
      'Data for correction not found',
      HttpStatus.NOT_FOUND,
    );
  }
};
