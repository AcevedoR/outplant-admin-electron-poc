import type {ChoiceToDisplayId} from '/@/model/todisplay/ChoiceToDisplay';

export interface CreateChoiceOutcome {
  parentId: ChoiceToDisplayId;
  id: string;
  text: string;
  in?: number;
  weight?: number;
}
