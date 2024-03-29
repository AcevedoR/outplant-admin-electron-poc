import type {ChoiceToDisplayId} from '/@/model/todisplay/ChoiceToDisplay';
import type {EventId} from '/@/model/todisplay/EventId';

export interface LinkEffect {
  parentId: EventId | ChoiceToDisplayId;
  effectName: string;
  activated: boolean;
}
