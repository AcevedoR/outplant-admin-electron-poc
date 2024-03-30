import type {ChoiceToDisplayId} from '/@/model/todisplay/ChoiceToDisplay';
import type {EventId} from '/@/model/todisplay/EventId';

export interface LinkEvent {
  parentId: EventId | ChoiceToDisplayId;
  event: EventId;
}
