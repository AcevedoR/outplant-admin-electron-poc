import type {Choice} from './Choice';
import type {Next} from './Next';

export interface Event {
  text: string;
  next?: Array<Next>;
  effects?: Record<string, boolean>;
  choices?: Array<Choice>;
}

export enum EventOutcomeType {
  NONE,
  CHOICES,
  EVENTS,
}

export function getEventOutcomeType(e: Event): EventOutcomeType {
  if (e.choices && e.choices.length > 0) {
    return EventOutcomeType.CHOICES;
  }
  // TODO the original model could be perfected here.. since an event can only have one and only Outcome type
  if (e.next && e.next.length > 0) {
    return EventOutcomeType.EVENTS;
  }
  return EventOutcomeType.NONE;
}
