import type {Chain} from '../model/Chain';
import type {ChoiceToDisplay} from '../model/todisplay/ChoiceToDisplay';
import {fromChoice} from '../model/todisplay/ChoiceToDisplay';
import type {EventToDisplay} from '/@/model/todisplay/EventToDisplay';
import {fromEvent} from '/@/model/todisplay/EventToDisplay';

interface FlowGraph {
  nodes: Node[];
  edges: Edge[];
}

export interface Node {
  id: string;
  type: string;
  data: NodeEvent;
  position: {x: number; y: number};
}

interface NodeEvent {
  name: string;
  event: EventToDisplay | undefined; // TODO do a single var with both types possible here, it would be probably better
  choice: ChoiceToDisplay | undefined;
}

interface Edge {
  id: string;
  type: string;
  source: string;
  target: string;
  label?: string;
}

export function generateFlowGraph(chain: Chain): FlowGraph {
  const edges: Edge[] = [];
  const nodes: Node[] = [];

  for (const event_name in chain.events) {
    const event_id = `${event_name}`;

    const event = chain.events[event_name];

    // if event has 'choices', then create them and link them
    if (event.choices && event.choices.length > 0) {
      for (let i = 0; i < event.choices.length; i++) {
        const choice = event.choices[i];

        const choiceToDisplay = fromChoice(event_id, i, choice, chain.effects);
        const choice_id = choiceToDisplay.id.get();
        const choice_node_id = `${choice_id}`;

        edges.push(create_edge(event_id, choice_node_id));
        nodes.push(
          create_node({
            event_id: choice_node_id,
            type: 'outplantChoiceNode',
            choice: choiceToDisplay,
          }),
        );

        // if choice has ChoiceOutcomes, link them to it
        if (choice.next && choice.next.length > 0) {
          for (const choice_outcome of choice.next) {
            edges.push(create_custom_edge(choice_node_id, choice_outcome.event, choice_outcome));
          }
        }
      }
    }

    // if event has 'next' events, link them to it
    if (event.next && event.next.length > 0) {
      for (const next_event of event.next) {
        edges.push(create_custom_edge(event_id, next_event.event, next_event));
      }
    }

    nodes.push(create_node({event_id, event: fromEvent(event, event_id, chain.effects)}));
  }
  return {
    nodes,
    edges,
  };
}

function create_node(opt: {
  event_id: string;
  type?: string;
  event?: EventToDisplay;
  choice?: ChoiceToDisplay;
}): Node {
  return {
    id: opt.event_id,
    type: opt.type ?? 'outplantEventNode',
    data: {
      name: opt.event_id,
      event: opt.event,
      choice: opt.choice,
    },
    position: {x: 0, y: 0},
    // sourcePosition: Position.Right,
    // targetPosition: Position.Left,
  };
}

function create_edge(source: string, target: string) {
  return {
    id: `${source}-->${target}`,
    source: source,
    target: target,
    type: 'default',
  };
}

function create_custom_edge(
  source: string,
  target: string,
  next: {in: number | null; weight: number | null} | undefined,
) {
  return {
    id: `${source}-->${target}`,
    source: source,
    target: target,
    type: 'outplantCustomEdge',
    data: {
      next: next,
    },
  };
}
