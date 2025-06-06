import { ProviderType } from '../../dto/manager.dto.in';

export interface BaseOptions {
  provider: ProviderType;
}

export interface CorrectionOptions extends BaseOptions {
  isBankrupt: boolean;
}

export interface DeletionOptions extends BaseOptions {
  includeApplication: boolean;
}

export type OperationOptions = CorrectionOptions | DeletionOptions;
