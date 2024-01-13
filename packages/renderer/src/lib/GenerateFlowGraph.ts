import type {Chain} from '../model/Chain';
import type {Event} from '../model/Event';
import type {Choice} from '../model/Choice';
import type {ChoiceToDisplay} from '../model/todisplay/ChoiceToDisplay';
import { fromChoice} from '../model/todisplay/ChoiceToDisplay';

interface FlowGraph {
  nodes: Node[],
  edges: Edge[]
}

interface Node {
  id: string,
  type: string,
  data: NodeEvent,
  position: {x: number, y: number}
}

interface NodeEvent {
  name: string,
  event: Event,// TODO do union here, it would be probably better
  choice: Choice
}

interface Edge {
  id: string,
  type: string,
  source: string,
  target: string,
  label?: string,
}

export function generateFlowGraph(chains: Chain[]): FlowGraph {
  const chain = chains[0];

  const edges: Edge[] = [];
  const nodes: Node[] = [];

  for (const event_name in chain.events) {
    const event_id = `${chain.title}__${event_name}`;

    const event = chain.events[event_name];

    // if event has 'choices', then create them and link them
    if (event.choices && event.choices.length > 0) {
      for (let i = 0; i < event.choices.length; i++) {
        const choice = event.choices[i];
        const choice_id = `${event_id}__${i}`;
        const choice_node_id = `choice:${choice_id}`;
        edges.push(create_edge(event_id, choice_node_id));
        nodes.push(create_node({event_id: choice_node_id, type: 'outplantChoiceNode', choice: fromChoice(choice, chain.effects)}));

        // if choice has ChoiceOutcomes, link them to it
        if (choice.next && choice.next.length > 0) {
          for (const choice_outcome of choice.next) {
            edges.push(create_edge(choice_node_id, `${chain.title}__${choice_outcome.event}`));
          }
        }
      }
    }

    // if event has 'next' events, link them to it
    if (event.next && event.next.length > 0) {
      for (const next_event of event.next) {
        edges.push(
          create_edge(event_id, `${chain.title}__${next_event.event}`),
        );
      }
    }

    nodes.push(create_node({event_id, event}));
  }
  return {
    nodes,
    edges,
  };
}

function create_node(opt: {event_id: string, type?: string, event?: Event, choice?: ChoiceToDisplay}): Node {
  // TODO next, convert Event into a EventToDisplay with full effect infos
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
    id: `${source}-->${target}`,// TODO add in and effects
    source: source,
    target: target,
    type: 'default',
  };
}
