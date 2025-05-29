export interface EquifaxCorrectionBody {
  XXXXXX: string;
  DDDD: Date;
  YY: CLOSURE_EVENTS | BANKRUPT_EVENTS | CESSION_EVENTS;
}

export interface EquifaxDeletionBody {
  XXXXXX: string;
  DDDD: Date;
  YY: SCORING_DELETION_ACTION | NBKI_DELETION_ACTION;
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
  DOGOVOR = 0,
}
