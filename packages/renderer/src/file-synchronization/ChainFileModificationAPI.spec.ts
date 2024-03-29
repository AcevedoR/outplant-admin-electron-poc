import {describe, expect, it, vi} from 'vitest';
import type {Chain} from '../model/Chain';
import {
  createChoice,
  createChoiceOutcome,
  createEffect,
  createEvent,
  editChoice,
  editEvent,
  linkEvent,
} from './ChainFileModificationAPI';
import {ChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
import {v4 as uuid} from 'uuid';
import type {Effect} from '../model/Effect';
import type {EventId} from '../model/todisplay/EventId';

const START_EVENT_ID_DEPRECATED: string = 'start'; // TODO replace with below EntityId
const START_EVENT_ID: EventId = {value: START_EVENT_ID_DEPRECATED}; // TODO replace with below EntityId
const CHAIN_ABSOLUTE_PATH: string = 'dummy chain absolute path';
const EMPTY_CHAIN: Chain = {
  title: 'my-chain-id-1',
  events: {
    start: {
      text: 'this is the chain start event text',
      effects: {},
      choices: [],
      next: null,
    },
  },
  effects: {},
  cooldown: 1,
  trigger: null,
  autoSelect: true,
};

vi.mock('../ElectronAPIUtils');

const someText = 'some text';

describe('testing modification of an Event of a Chain', () => {
  it('should edit event text', () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const newText = 'my new text';

    editEvent(CHAIN_ABSOLUTE_PATH, chain, START_EVENT_ID_DEPRECATED, newText);

    expect(chain.events[START_EVENT_ID_DEPRECATED]).toEqual({
      text: newText,
      effects: {},
      choices: [],
      next: null,
    });
  });

  it('should create event with text only', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const text = 'a new event with text';
    const eventId = 'my-new-event-id';

    await createEvent(CHAIN_ABSOLUTE_PATH, chain, {
      id: eventId,
      text: text,
      parentEventId: START_EVENT_ID_DEPRECATED,
    });

    expect(
      chain.events[START_EVENT_ID_DEPRECATED].next,
      'parent event.next should have been linked to new event',
    ).toEqual([
      {
        event: eventId,
        in: null,
        weight: null,
        effects: null,
      },
    ]);

    expect(chain.events[eventId], 'event itself should have been created').toEqual({
      text: text,
      next: null,
      effects: null,
      choices: null,
    });
  });

  it('should not allow creating a choice on an event outcoming events', async () => {
    const chain = deepCopy(EMPTY_CHAIN);

    await given('given the start_event already has one outcoming event', async () => {
      await createEvent(CHAIN_ABSOLUTE_PATH, chain, {
        id: 'new-event-1',
        text: someText,
        parentEventId: START_EVENT_ID_DEPRECATED,
      });
    });

    expect(() =>
      createChoice(CHAIN_ABSOLUTE_PATH, chain, {
        text: someText,
        parentEventId: START_EVENT_ID_DEPRECATED,
      }),
    ).toThrowError('cannot create a choice on an event outcoming events');
  });

  it('should not allow creating an event on an event outcoming choices', async () => {
    const chain = deepCopy(EMPTY_CHAIN);

    await given('given the start_event already has one outcoming choice', async () => {
      await createChoice(CHAIN_ABSOLUTE_PATH, chain, {
        text: someText,
        parentEventId: START_EVENT_ID_DEPRECATED,
      });
    });

    expect(() =>
      createEvent(CHAIN_ABSOLUTE_PATH, chain, {
        id: 'eventid',
        text: someText,
        parentEventId: START_EVENT_ID_DEPRECATED,
      }),
    ).toThrowError('cannot create an event on an event outcoming choices');
  });

  it('should not allow linking an un-existing event', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    expect(() =>
      linkEvent(CHAIN_ABSOLUTE_PATH, chain, START_EVENT_ID_DEPRECATED, 'unexisting-event-id'),
    ).toThrowError('event should exist');
  });

  it('should not allow linking to an un-existing parent event', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    expect(() =>
      linkEvent(
        CHAIN_ABSOLUTE_PATH,
        chain,
        'unexisting-parent-event-id',
        START_EVENT_ID_DEPRECATED,
      ),
    ).toThrowError('parent event should exist');
  });

  it('should not allow linking an event on an event outcoming choices', async () => {
    const chain = deepCopy(EMPTY_CHAIN);

    const firstEvent = 'first-event';
    const secondEventWithChoice = 'second-event-with-choice';

    await given('given the start_event has two events', async () => {
      await createEvent(CHAIN_ABSOLUTE_PATH, chain, {
        id: firstEvent,
        text: someText,
        parentEventId: START_EVENT_ID_DEPRECATED,
      });
      await createEvent(CHAIN_ABSOLUTE_PATH, chain, {
        id: secondEventWithChoice,
        text: someText,
        parentEventId: START_EVENT_ID_DEPRECATED,
      });
    });
    await given('given the second event has a choice', async () => {
      await createChoice(CHAIN_ABSOLUTE_PATH, chain, {
        text: someText,
        parentEventId: secondEventWithChoice,
      });
    });

    expect(() =>
      linkEvent(CHAIN_ABSOLUTE_PATH, chain, secondEventWithChoice, firstEvent),
    ).toThrowError('cannot link an event on an event outcoming choices');
  });
});

describe('testing modification of a Choice of a Chain', () => {
  it('should edit choice text', () => {
    const chain = deepCopy(EMPTY_CHAIN);
    chain.events[START_EVENT_ID_DEPRECATED].choices.push({
      text: 'my original choice text',
      effects: {},
      next: null,
    });

    const choiceId: ChoiceToDisplayId = new ChoiceToDisplayId(START_EVENT_ID_DEPRECATED, 0);
    const newText = 'my new text';

    editChoice(CHAIN_ABSOLUTE_PATH, chain, choiceId, newText);

    expect(chain.events[START_EVENT_ID_DEPRECATED].choices).toEqual([
      {
        text: newText,
        effects: {},
        next: null,
      },
    ]);
  });

  it('should create choice', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const text = 'a new choice with text';

    await createChoice(CHAIN_ABSOLUTE_PATH, chain, {
      parentEventId: START_EVENT_ID_DEPRECATED,
      text: text,
    });

    expect(
      chain.events[START_EVENT_ID_DEPRECATED].choices,
      'choice should have been created on parent event',
    ).toEqual([
      {
        text: text,
        next: [],
        effects: null,
      },
    ]);
  });

  it('cannot create a choice from an unexisting event', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const text = 'a new choice with text';

    expect(() =>
      createChoice(CHAIN_ABSOLUTE_PATH, chain, {
        parentEventId: 'unknown-parent-event-id',
        text: text,
      }),
    ).toThrowError('choice parent event does not exist');
  });

  it('should create an event from a choice', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const text = 'a new event with text';

    const choiceId = new ChoiceToDisplayId(START_EVENT_ID_DEPRECATED, 0);
    const newEventId = uuid();
    await given('given the start_event has a choice', async () => {
      await createChoice(CHAIN_ABSOLUTE_PATH, chain, {
        text: someText,
        parentEventId: START_EVENT_ID_DEPRECATED,
      });
    });

    await createChoiceOutcome(CHAIN_ABSOLUTE_PATH, chain, {
      parentId: choiceId,
      id: newEventId,
      text: text,
    });

    expect(
      chain.events[START_EVENT_ID_DEPRECATED].choices,
      'choice should have a new outcoming event',
    ).toEqual([
      {
        text: someText,
        next: [
          {
            event: newEventId,
            in: null,
            weight: null,
            effects: null,
          },
        ],
        effects: null,
      },
    ]);
    expect(chain.events[newEventId], 'new event should have been created').toEqual({
      text: text,
      next: null,
      effects: null,
      choices: null,
    });
  });
});

describe('testing effect creation', () => {
  it('should create effect on an event', () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const effectName = 'my-new-effect';
    const newEffect: Effect = {
      description: 'desc',
      type: 'instant',
      value: 1,
      operation: 'add',
      target: 'population',
    };
    const activated = true;

    createEffect(CHAIN_ABSOLUTE_PATH, chain, {
      parentId: START_EVENT_ID,
      effectName: effectName,
      newEffect: newEffect,
      activated: activated,
    });

    expect(chain.effects, 'effect should have been created in the chain').toEqual({
      'my-new-effect': newEffect,
    });

    expect(
      chain.events[START_EVENT_ID.value],
      'effect should have been trigger in event',
    ).toHaveProperty('effects', {'my-new-effect': activated});
  });

  it('should create effect on an choice', () => {
    const chain = deepCopy(EMPTY_CHAIN);
    given('given a choice without effects', async () =>
      createChoice(CHAIN_ABSOLUTE_PATH, chain, {
        text: someText,
        parentEventId: START_EVENT_ID.value,
      }),
    );
    const effectName = 'my-new-effect';
    const newEffect: Effect = {
      description: 'desc',
      type: 'instant',
      value: 1,
      operation: 'add',
      target: 'population',
    };
    const activated = true;

    createEffect(CHAIN_ABSOLUTE_PATH, chain, {
      parentId: {parentId: START_EVENT_ID.value, choiceIndex: 0} as ChoiceToDisplayId,
      effectName: effectName,
      newEffect: newEffect,
      activated: activated,
    });

    expect(chain.effects, 'effect should have been created in the chain').toEqual({
      'my-new-effect': newEffect,
    });

    expect(
      chain.events[START_EVENT_ID.value].choices[0],
      'effect should have been trigger in choice',
    ).toHaveProperty('effects', {'my-new-effect': activated});
  });
});

function deepCopy(variable: Chain) {
  return JSON.parse(JSON.stringify(variable));
}
async function given(description: string, f: () => Promise<void>) {
  await f();
}
