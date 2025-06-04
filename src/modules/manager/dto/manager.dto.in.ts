export enum OperationType {
  CORRECTION = 'correction',
  DELETION = 'deletion',
}

export enum ProviderType {
  EQUIFAX = 'equifax',
  NBKI = 'nbki',
}

export interface EquifaxDeletionBody {
  treaty_id: number;
  deleting_from: SCORING_DELETION_ACTION | NBKI_DELETION_ACTION.NBKI;
  action: SCORING_DELETION_ACTION | NBKI_DELETION_ACTION.TREATY_AND_APPLICATION;
  is_treaty?: NBKI_DELETION_ACTION.IS_TREATY;
}

export enum ORIGINAL_CLOSURE_EVENTS {
  PDL = 2,
  INSTALLMENT = 4,
}

export enum CLOSURE_EVENTS {
  PDL = 6,
  INSTALLMENT = 16,
}

export enum BANKRUPT_EVENTS {
  PDL = 8,
  INSTALLMENT = 18,
}

export enum CESSION_EVENTS {
  PDL = 27,
  INSTALLMENT = 37,
}

export enum SCORING_DELETION_ACTION {
  SCORING = 'EQUIFAX',
  TREATY = 'D',
  APPLICATION = 'C.4',
  TREATY_APPLICATION = 'C.2',
}

export enum NBKI_DELETION_ACTION {
  NBKI = 'NBKI',
  TREATY_AND_APPLICATION = 'D',
  TREATY_C56 = 'C.2',
  IS_TREATY = 0,
}
