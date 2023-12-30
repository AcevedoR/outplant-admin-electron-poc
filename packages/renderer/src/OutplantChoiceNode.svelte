<script lang="ts">
    import {Handle, type NodeProps, Position} from '@xyflow/svelte';

    type $$Props = NodeProps;

    export let data: $$Props['data'];
    export let isConnectable: $$Props['isConnectable'];

    const {choice} = data;
</script>

<Handle type="target" position={Position.Left} style="background: #555;" {isConnectable}/>
<Handle
        type="source"
        position={Position.Right}
        style={{ top: 10, background: '#555' }}
        isConnectable={isConnectable}
/>
<div>
    {choice.text.replace(/ #.*$/i, '')}
</div>

<style>
    :global(.svelte-flow__node-outplantChoiceNode) {
        font-size: 12px;
        max-width: 200px;
        background: #afaeae;
        border: 1px solid #818181;
        border-radius: 10%;
        text-align: center;
        padding: 10px;
    }
</style>