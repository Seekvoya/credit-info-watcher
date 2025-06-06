import {
  BANKRUPT_EVENTS,
  CLOSURE_EVENTS,
  ORIGINAL_CLOSURE_EVENTS,
} from '../../manager/dto/manager.dto.in';

export interface ProcessedCreditData {
  uid: string | unknown;
  treaty_id: number;
  treaty_num: number;
  treaty_date_stop: Date;
  treaty_date_end: Date;
  treaty_client_id: number;
  treaty_event_status:
    | string
    | ORIGINAL_CLOSURE_EVENTS
    | BANKRUPT_EVENTS
    | CLOSURE_EVENTS;
}
