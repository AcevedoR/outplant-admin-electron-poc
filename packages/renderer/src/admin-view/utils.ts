import type {Effect} from '/@/model/Effect';
import type {EffectToDisplay} from '/@/model/todisplay/EffectToDisplay';
import type {NextToDisplay} from '/@/model/todisplay/NextToDisplay';
import type {Event} from '/@/model/Event';

export function getAvailableEffects(
  chainEffects: Record<string, Effect>,
  effectToFilterOut: EffectToDisplay[],
): Record<string, Effect> {
  const res: Record<string, Effect> = {};
  Object.entries(chainEffects)
    .filter(([name, _effect]) => !effectToFilterOut.find(x => x.id === name))
    .forEach(([name, effect]) => (res[name] = effect));
  return res;
}

export function getAvailableEvents(
  chainEffects: Record<string, Event>,
  eventsToFilterOut: NextToDisplay[] | null,
): Record<string, Event> {
  if (!eventsToFilterOut) {
    return chainEffects;
  }
  const res: Record<string, Event> = {};
  Object.entries(chainEffects)
    .filter(([name, _effect]) => !eventsToFilterOut.find(x => x.event === name))
    .forEach(([name, effect]) => (res[name] = effect));
  return res;
}
