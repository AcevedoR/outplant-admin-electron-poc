<script lang="ts">
    import {writable} from 'svelte/store';
    import {
        Background,
        BackgroundVariant,
        Controls,
        type Edge,
        MiniMap,
        type Node,
        Panel,
        Position,
        SvelteFlow
    } from '@xyflow/svelte';

    // 👇 this is important! You need to import the styles for Svelte Flow to work
    import '@xyflow/svelte/dist/style.css';
    import {getExampleChains} from "./lib/GetExampleChains";
    import OutplantEventNode from "./OutplantEventNode.svelte";
    import type {Chain} from "./model/Chain";


    // trying out autolayout
    import dagre from '@dagrejs/dagre';

    import {generateFlowGraph} from "./lib/GenerateFlowGraph";
    import OutplantChoiceNode from "./OutplantChoiceNode.svelte";


    const nodeTypes = {
        outplantEventNode: OutplantEventNode,
        outplantChoiceNode: OutplantChoiceNode,
    };

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({rankdir: 'LR'});

    const nodeWidth = 250;
    const nodeHeight = 50;

    const chains: Chain[] = getExampleChains();

    let flowGraph = generateFlowGraph(chains);

    const nodes = writable(flowGraph.nodes);
    const edges = writable(flowGraph.edges)
    onLayout('LR');// autolayout to horizontal by default


    // auto layout functions
    function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({rankdir: direction});

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, {width: nodeWidth, height: nodeHeight});
        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        nodes.forEach((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.targetPosition = isHorizontal ? Position.Left : Position.Top;
            node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2
            };
        });

        return {nodes, edges};
    }

    function onLayout(direction: string) {
        const layoutedElements = getLayoutedElements($nodes, $edges, direction);

        $nodes = layoutedElements.nodes;
        $edges = layoutedElements.edges;
        // nodes.set(layoutedElements.nodes);
        // edges.set(layoutedElements.edges);
    }
</script>

<!--
👇 By default, the Svelte Flow container has a height of 100%.
This means that the parent container needs a height to render the flow.
-->
<div style:height="100vh">
    <SvelteFlow
            {nodes}
            {edges}
            {nodeTypes}
            fitView
            on:nodeclick={(event) => console.log('on node click', event.detail.node)}
    >
        <Controls/>
        <Background variant={BackgroundVariant.Dots}/>
        <MiniMap/>
        <Panel position="top-right">
            <button on:click={() => onLayout('TB')}>vertical layout</button>
            <button on:click={() => onLayout('LR')}>horizontal layout</button>
        </Panel>
    </SvelteFlow>
</div>
