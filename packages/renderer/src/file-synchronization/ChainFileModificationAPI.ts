import type {Chain} from '../model/Chain';
import type {Event} from '../model/Event';
import {EventOutcomeType, getEventOutcomeType} from '../model/Event';
import type {ChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
import {updateChainFile} from '../ElectronAPIUtils';
import type {CreateEvent} from './CreateEvent';
import type {CreateChoice} from './CreateChoice';

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
  const parentEvent = chain.events[createEvent.parentEventId];
  if (!parentEvent) {
    throw new Error('parent event should exist');
  }
  if (getEventOutcomeType(parentEvent) === EventOutcomeType.CHOICES) {
    throw new Error('cannot create an event on an event outcoming choices');
  }

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

export function linkEvent(
  chainFileAbsolutePath: string,
  chain: Chain,
  parentEventId: string,
  eventId: string,
): Promise<void> {
  const event = chain.events[eventId];
  if (!event) {
    throw new Error('event should exist');
  }
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

export function createChoice(
  chainFileAbsolutePath: string,
  chain: Chain,
  createChoice: CreateChoice,
): Promise<void> {
  const parent_event: Event = chain.events[createChoice.parentEventId];

  if (!parent_event) {
    throw new Error('choice parent event does not exist');
  }
  if (getEventOutcomeType(parent_event) === EventOutcomeType.EVENTS) {
    throw new Error('cannot create a choice on an event outcoming events');
  }

  if (!parent_event.choices) {
    parent_event.choices = [];
  }

  parent_event.choices.push({
    text: createChoice.text,
    next: [],
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
