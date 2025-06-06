import { ProcessedCreditData } from 'src/modules/watcher/dto/watcher.dto.out';
import {
  BANKRUPT_EVENTS,
  CLOSURE_EVENTS,
  EquifaxDeletionBody,
  NBKI_DELETION_ACTION,
  ORIGINAL_CLOSURE_EVENTS,
  ProviderType,
  SCORING_DELETION_ACTION,
} from '../dto/manager.dto.in';
import {
  CorrectionOptions,
  DeletionOptions,
  OperationOptions,
} from './types/query-options.dto';

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
        : CLOSURE_EVENTS.INSTALLMENT;
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
