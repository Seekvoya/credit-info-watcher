import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ProcessedCreditData } from '../watcher/dto/watcher.dto.out';
import {
  BANKRUPT_EVENTS,
  CLOSURE_EVENTS,
  EquifaxDeletionBody,
  NBKI_DELETION_ACTION,
  ORIGINAL_CLOSURE_EVENTS,
  ProviderType,
  SCORING_DELETION_ACTION,
} from './dto/manager.dto.in';
import { connectionSource } from 'src/config/ormConfig';

// ===== REQUEST BUILDERS =====
interface IEquifaxRequestBuilder {
  buildRequest(data: ProcessedCreditData, options: OperationOptions): any;
}

export class EquifaxCorrectionBuilder implements IEquifaxRequestBuilder {
  buildRequest(data: ProcessedCreditData, options: CorrectionOptions) {
    const query: Partial<ProcessedCreditData> = {};

    if (data.treaty_event_status === ORIGINAL_CLOSURE_EVENTS.PDL) {
      query.treaty_event_status = options.isBankrupt
        ? BANKRUPT_EVENTS.PDL
        : CLOSURE_EVENTS.PDL;
    }

    if (data.treaty_event_status === ORIGINAL_CLOSURE_EVENTS.INSTALLMENT) {
      query.treaty_event_status = options.isBankrupt
        ? BANKRUPT_EVENTS.INSTALLMENT
        : BANKRUPT_EVENTS.INSTALLMENT;
    }

    return query;
  }
}

export class EquifaxDeletionBuilder implements IEquifaxRequestBuilder {
  buildRequest(
    data: ProcessedCreditData,
    options: DeletionOptions,
  ): EquifaxDeletionBody {
    const request: EquifaxDeletionBody = {
      treaty_id: data.treaty_id,
      deleting_from:
        options.provider === ProviderType.NBKI
          ? NBKI_DELETION_ACTION.NBKI
          : SCORING_DELETION_ACTION.SCORING,
      action: this.getActionByProvider(options),
    };

    if (options.provider === ProviderType.NBKI && options.includeApplication) {
      request.is_treaty = NBKI_DELETION_ACTION.IS_TREATY;
    }

    return request;
  }

  private getActionByProvider(options: DeletionOptions) {
    if (options.provider === ProviderType.NBKI) {
      return NBKI_DELETION_ACTION.TREATY_AND_APPLICATION;
    }

    return options.includeApplication
      ? SCORING_DELETION_ACTION.APPLICATION
      : SCORING_DELETION_ACTION.TREATY;
  }
}

// ===== TYPED OPTIONS =====
interface BaseOptions {
  provider: ProviderType;
}

interface CorrectionOptions extends BaseOptions {
  isBankrupt: boolean;
}

interface DeletionOptions extends BaseOptions {
  includeApplication: boolean;
}

type OperationOptions = CorrectionOptions | DeletionOptions;

// ===== REPOSITORY PATTERN =====
@Injectable()
export class EquifaxRepository {
  async insertDeletion(data: EquifaxDeletionBody): Promise<void> {
    await connectionSource
      .createQueryBuilder()
      .insert()
      .into('api_bki_deleting')
      .values({
        ID_DOG: data.treaty_id,
        deletion_from: data.deleting_from,
        action: data.action,
        ...(data.is_treaty !== undefined && { is_treaty: data.is_treaty }),
      })
      .execute();
  }

  async insertCorrection(data: Partial<ProcessedCreditData>): Promise<void> {
    await connectionSource
      .createQueryBuilder()
      .insert()
      .into('equifax_dogovor')
      .values({
        ID_DOG: data.treaty_id,
        date: data.treaty_date_end,
        event: data.treaty_event_status,
      })
      .execute();
  }
}
// ===== MAIN SERVICE =====
@Injectable()
export class ManagerService {
  private readonly correctionBuilder = new EquifaxCorrectionBuilder();
  private readonly deletionBuilder = new EquifaxDeletionBuilder();

  constructor(
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

  // ===== VALIDATION =====
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
