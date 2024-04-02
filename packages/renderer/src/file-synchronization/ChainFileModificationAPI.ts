import type {Chain} from '../model/Chain';
import type {Event} from '../model/Event';
import {EventOutcomeType, getEventOutcomeType} from '../model/Event';
import type {ChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
import {isChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
import {updateChainFile} from '../ElectronAPIUtils';
import type {CreateEvent} from './CreateEvent';
import type {CreateChoice} from './CreateChoice';
import type {CreateChoiceOutcome} from '/@/file-synchronization/CreateChoiceOutcome';
import type {CreateEffect} from '/@/file-synchronization/CreateEffect';
import type {EventId} from '/@/model/todisplay/EventId';
import type {LinkEffect} from '/@/file-synchronization/LinkEffect';
import type {LinkEvent} from '/@/file-synchronization/LinkEvent';

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

  return linkEvent(chainFileAbsolutePath, chain, {
    parentId: {value: createEvent.parentEventId},
    event: {value: createEvent.id},
    in: createEvent.in,
    weight: createEvent.weight,
  });
}

export function linkEvent(
  chainFileAbsolutePath: string,
  chain: Chain,
  linkEvent: LinkEvent,
): Promise<void> {
  if (isChoiceToDisplayId(linkEvent.parentId)) {
    const choiceId: ChoiceToDisplayId = linkEvent.parentId as ChoiceToDisplayId;
    const parentChoiceParentEvent = chain.events[choiceId.parentId];
    if (!parentChoiceParentEvent) {
      throw new Error('parent event of parent choice should exist');
    }
    if (!parentChoiceParentEvent.choices) {
      parentChoiceParentEvent.choices = [];
    }
    const parentChoice = parentChoiceParentEvent.choices[choiceId.choiceIndex];
    if (!parentChoice) {
      throw new Error('parent choice should exist');
    }

    parentChoice.next.push({
      event: linkEvent.event.value,
      in: linkEvent.in ? linkEvent.in : null,
      weight: linkEvent.weight ? linkEvent.weight : null,
      effects: null,
    });
  } else {
    const parentEventId = (linkEvent.parentId as EventId).value;

    const event = chain.events[linkEvent.event.value];
    if (!event) {
      throw new Error('event should exist');
    }
    const parentEvent = chain.events[parentEventId];
    if (!parentEvent) {
      throw new Error('parent event should exist');
    }
    if (getEventOutcomeType(parentEvent) === EventOutcomeType.CHOICES) {
      throw new Error('cannot link an event on an event outcoming choices');
    }

    if (!parentEvent.next) {
      parentEvent.next = [];
    }
    parentEvent.next.push({
      event: linkEvent.event.value,
      in: linkEvent.in ? linkEvent.in : null,
      weight: linkEvent.weight ? linkEvent.weight : null,
      effects: null,
    });
  }

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

export function createChoiceOutcome(
  chainFileAbsolutePath: string,
  chain: Chain,
  createChoiceOutcome: CreateChoiceOutcome,
): Promise<void> {
  const parentEvent = chain.events[createChoiceOutcome.parentId.parentId];
  if (!parentEvent) {
    throw new Error('parent event should exist');
  }
  if (!parentEvent.choices) {
    parentEvent.choices = [];
  }

  const choice = parentEvent.choices[createChoiceOutcome.parentId.choiceIndex];
  if (!choice) {
    throw new Error('could not find choice');
  }

  if (!choice.next) {
    choice.next = [];
  }

  choice.next.push({
    event: createChoiceOutcome.id,
    effects: null,
    weight: createChoiceOutcome.weight ? createChoiceOutcome.weight : null,
    in: createChoiceOutcome.in ? createChoiceOutcome.in : null,
  });

  chain.events[createChoiceOutcome.id] = {
    text: createChoiceOutcome.text,
    choices: null,
    next: null,
    effects: null,
  };

  return requestUpdateChainFile(chainFileAbsolutePath, chain);
}

export function createEffect(
  chainFileAbsolutePath: string,
  chain: Chain,
  createEffect: CreateEffect,
): Promise<void> {
  console.debug(createEffect);
  if (chain.effects[createEffect.effectName]) {
    throw new Error('cannot create effect, it already exists');
  }
  chain.effects[createEffect.effectName] = createEffect.newEffect;

  return linkEffect(chainFileAbsolutePath, chain, {
    parentId: createEffect.parentId,
    effectName: createEffect.effectName,
    activated: createEffect.activated,
  });
}

export function linkEffect(
  chainFileAbsolutePath: string,
  chain: Chain,
  linkEffect: LinkEffect,
): Promise<void> {
  if (isChoiceToDisplayId(linkEffect.parentId)) {
    const choiceId = linkEffect.parentId as ChoiceToDisplayId;
    const parentEvent = chain.events[choiceId.parentId];
    if (!parentEvent) {
      throw new Error('choice parent event could not be found');
    }
    if (!parentEvent.choices) {
      parentEvent.choices = [];
    }

    const choice = parentEvent.choices[choiceId.choiceIndex];
    if (!choice) {
      throw new Error('choice could not be found');
    }
    if (!choice.effects) {
      choice.effects = {};
    }
    if (choice.effects[linkEffect.effectName]) {
      throw new Error('effect is already triggered by this choice');
    }

    choice.effects[linkEffect.effectName] = linkEffect.activated;
  } else {
    const eventId = linkEffect.parentId as EventId;
    const event = chain.events[eventId.value];

    if (!event) {
      throw new Error('event could not be found');
    }
    if (!event.effects) {
      event.effects = {};
    }
    if (event.effects[linkEffect.effectName]) {
      throw new Error('event already have this effect triggered');
    }

    event.effects[linkEffect.effectName] = linkEffect.activated;
  }
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
