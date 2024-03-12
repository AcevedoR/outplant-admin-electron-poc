import type {Chain} from '../model/Chain';
import type {ChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
import {updateChainFile} from '../ElectronAPIUtils';
import type {CreateEvent} from './CreateEvent';

export function editChoice(
  chainFileAbsolutePath: string,
  chain: Chain,
  choiceId: ChoiceToDisplayId,
  text: string,
): Promise<void> {
  const event = chain.events[choiceId.parentId];

  if (!event) {
    throw new Error('event should exist');
  }
  if (!event.choices) {
    throw new Error('event should contain choices');
  }

  const choice = event.choices[choiceId.choiceIndex];
  choice.text = text;
  console.log('modified choice text to: ' + choice.text);

  return requestUpdateChainFile(chainFileAbsolutePath, chain);
}

export function editEvent(
  chainFileAbsolutePath: string,
  chain: Chain,
  eventId: string,
  text: string,
): Promise<void> {
  const event = chain.events[eventId];

  if (!event) {
    throw new Error('event should exist');
  }

  event.text = text;
  console.log('modified event text to: ' + event.text);

  return requestUpdateChainFile(chainFileAbsolutePath, chain);
}

export function createEvent(
  chainFileAbsolutePath: string,
  chain: Chain,
  createEvent: CreateEvent,
): Promise<void> {
  const event_with_same_id = chain.events[createEvent.id];

  if (event_with_same_id) {
    throw new Error('event with that id already exists');
  }

  chain.events[createEvent.id] = {
    text: createEvent.text,
    next: null,
    choices: null,
    effects: null,
  };

  return linkEvent(chainFileAbsolutePath, chain, createEvent.parentEventId, createEvent.id);
}

export function linkEvent(chainFileAbsolutePath: string, chain: Chain, parentEventId: string, eventId: string): Promise<void> {
  const parentEvent = chain.events[parentEventId];
  if (!parentEvent) {
    throw new Error('parent event should exist');
  }

  if (!parentEvent.next) {
    parentEvent.next = [];
  }
  parentEvent.next.push({
    event: eventId,
    in: null,
    weight: null,
    effects: null,
  });

  return requestUpdateChainFile(chainFileAbsolutePath, chain);
}

function requestUpdateChainFile(chainFileAbsolutePath: string, chain: Chain) {
  const filterOutNullPropertiesReplacer = (key: number | string, value: number | string) => {
    if (value === null) {
      return undefined;
    }
    return value;
  };

  return updateChainFile(
    chainFileAbsolutePath,
    JSON.stringify(chain, filterOutNullPropertiesReplacer, 2),
  );
}
