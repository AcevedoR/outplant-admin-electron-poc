<script lang="ts">
    import {Handle, type NodeProps, Position} from '@xyflow/svelte';

    type $$Props = NodeProps;

    export let data: $$Props['data'];
    export let isConnectable: $$Props['isConnectable'];

    const {name} = data;
</script>

<Handle type="target" position={Position.Left} style="background: #555;" {isConnectable}/>
<Handle
        type="source"
        position={Position.Right}
        style={{ top: 10, background: '#555' }}
        isConnectable={isConnectable}
/>
<div>
    {name}
</div>

<style>
    :global(.svelte-flow__node-outplantEventNode) {
        font-size: 12px;
        background: #deab36;
        border: 1px solid #555;
        text-align: center;
        padding: 10px;
    }
</style>