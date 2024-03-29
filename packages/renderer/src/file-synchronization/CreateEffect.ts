import type {Effect} from '/@/model/Effect';
import type {ChoiceToDisplayId} from '/@/model/todisplay/ChoiceToDisplay';
import type {EventId} from '/@/model/todisplay/EventId';

export interface CreateEffect {
  parentId: EventId | ChoiceToDisplayId;
  effectName: string;
  newEffect: Effect;
  activated: boolean;
}
