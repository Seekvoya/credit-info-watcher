import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ProcessedCreditData } from '../watcher/dto/watcher.dto.out';
import {
  CorrectionOptions,
  DeletionOptions,
} from './request-builders/types/query-options.dto';
import { EquifaxRepository } from './repository/equifax-repository';
import {
  EquifaxCorrectionBuilder,
  EquifaxDeletionBuilder,
} from './request-builders/request-builders';
import { EquifaxDeletionBody } from './dto/manager.dto.in';

@Injectable()
export class ManagerService {
  private readonly correctionBuilder = new EquifaxCorrectionBuilder();
  private readonly deletionBuilder = new EquifaxDeletionBuilder();

  constructor(
    @Inject()
    private readonly equifaxRepository: EquifaxRepository,
    private readonly logger: Logger,
  ) {}

  async processCorrection(
    data: ProcessedCreditData,
    options: CorrectionOptions,
  ) {
    this.validateCorrectionData(data);

    try {
      const correctionQuery = this.correctionBuilder.buildRequest(
        data,
        options,
      );
      await this.equifaxRepository.insertCorrection(correctionQuery);

      this.logger.log(`Correction processed for treaty ${data.treaty_id}`);
      return correctionQuery;
    } catch (error) {
      this.logger.error(
        `Correction failed for treaty ${data.treaty_id}`,
        error,
      );
      throw new HttpException(
        'Failed to process correction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processDeletion(
    data: ProcessedCreditData,
    options: DeletionOptions,
  ): Promise<EquifaxDeletionBody> {
    this.validateDeletionData(data);

    try {
      const deletionQuery = this.deletionBuilder.buildRequest(data, options);
      await this.equifaxRepository.insertDeletion(deletionQuery);

      this.logger.log(`Deletion processed for treaty ${data.treaty_id}`);
      return deletionQuery;
    } catch (error) {
      this.logger.error(`Deletion failed for treaty ${data.treaty_id}`, error);
      throw new HttpException(
        'Failed to process deletion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateCorrectionData(data: ProcessedCreditData): void {
    if (!data?.treaty_date_end || !data?.treaty_event_status) {
      throw new HttpException(
        'Invalid correction data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private validateDeletionData(data: ProcessedCreditData): void {
    if (!data?.treaty_id) {
      throw new HttpException('Invalid deletion data', HttpStatus.BAD_REQUEST);
    }
  }
}
