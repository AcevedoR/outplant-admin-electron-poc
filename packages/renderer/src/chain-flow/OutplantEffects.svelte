<script lang="ts">
  import type {EffectToDisplay} from '/@/model/todisplay/EffectToDisplay';
  import {faDollarSign, faMinus, faPlus, faTree, faUser} from '@fortawesome/free-solid-svg-icons';
  import {Fa} from 'svelte-fa';
  import type {ChangeTarget} from '/@/model/ChangeTarget';

  export let effects: EffectToDisplay[];

  function toSymbol(operationTarget: ChangeTarget) {
    switch (operationTarget) {
      case 'population':
        return faUser;
      case 'ecology':
        return faTree;
      case 'money':
        return faDollarSign;
      default:
        throw new Error('unknown change target');
    }
  }
</script>

<div>
  <div class="outplantEffects">
  {#each effects as effect (effect)}
    <div class="outplantEffect {effect.operation === 'add' ? 'positive-effect' : 'negative-effect'}">
      <p>{effect.id}</p>
      <Fa class="operation-symbol" icon={effect.operation === 'add' ? faPlus : faMinus} />
      <p>{effect.value}
      </p>
      <Fa class="operation-target" icon={toSymbol(effect.target)} />
    </div>
  {/each}
  </div>
</div>

<style>
    :global(.outplantEffects) {
      max-width: 200px;
    }

    :global(.outplantEffects .outplantEffect) {
        display: inline-flex;
        padding: 0 5px;
        font-size: 12px;
        max-width: 200px;
        transform: skewX(-15deg);
        color: black;
    }

    :global(.outplantEffects .outplantEffect .operation-symbol,.operation-target) {
        display: block;
        font-size: 15px;
        margin: auto 5px auto 5px;
    }

    :global(.outplantEffects .outplantEffect.positive-effect) {
        background: rgba(139, 241, 31, 0.5);
    }

    :global(.outplantEffects .outplantEffect.negative-effect) {
        background: rgba(255, 0, 0, 0.54);
    }

    :global(.outplantEffects .outplantEffect p) {
        padding: 0;
        margin: 0;
    }
</style>
