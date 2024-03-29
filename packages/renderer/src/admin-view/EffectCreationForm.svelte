<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Input from '/@/admin-view/Input.svelte';
  import type {EventId} from '../model/todisplay/EventId';
  import {ChoiceToDisplayId, isChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
  import type {ChangeOperation} from '../model/ChangeOperation';
  import type {ChangeTarget} from '../model/ChangeTarget';
  import type {EffectType} from '../model/EffectType';
  import Select from '/@/admin-view/Select.svelte';
  import type {CreateEffect} from '/@/file-synchronization/CreateEffect';
  import type {Effect} from '/@/model/Effect';
  import Checkbox from '/@/admin-view/Checkbox.svelte';

  export let parentId: EventId | ChoiceToDisplayId;

  let effectName: string;
  let description: string | null = null;
  let operation: ChangeOperation;
  let target: ChangeTarget;
  let value: number;
  let type: EffectType;
  let activated: boolean = true;

  const dispatch = createEventDispatcher();

  $: formResult = {
    effectName, description, operation, target, value, type, activated,
  };
  $: errors = validate(formResult);

  interface EventCreationFormErrors {
    effectName: string | undefined,
    description: string | undefined
    operation: string | undefined
    target: string | undefined
    value: string | undefined
    type: string | undefined
    activated: string | undefined
  }

  const validate = (formResult: {
    effectName: string,
    description: string,
    operation: string,
    target: string,
    value: number,
    type: string,
    activated: boolean
  }): EventCreationFormErrors => {
    console.log('validate: ' + formResult.effectName);
    let errorOnEffectName;
    let errorOnDescription;
    let errorOnOperation;
    let errorOnTarget;
    let errorOnValue;
    let errorOnType;
    let errorOnActivated;

    let regexp = '^[A-Za-z\-\_0-9]*$';
    if (!formResult.effectName || (formResult.effectName && !formResult.effectName.match(regexp))) {
      errorOnEffectName = 'should match regexp ' + regexp;
    }
    if (!formResult.value || formResult.value < 0) {
      errorOnValue = 'positive value is required';
    }
    return {
      effectName: errorOnEffectName,
      description: errorOnDescription,
      operation: errorOnOperation,
      target: errorOnTarget,
      value: errorOnValue,
      type: errorOnType,
      activated: errorOnActivated,
    } as EventCreationFormErrors;
  };

  function isErrorObjectEmpty() {
    return !Object.values(errors).find(x => x);
  }

  const validateAndSubmitOnCreateEvent = (
    parentEventId: EventId | ChoiceToDisplayId,
    effectName: string,
    description: string | null,
    operation: ChangeOperation,
    target: ChangeTarget,
    value: number,
    type: EffectType,
    activated: boolean,
  ) => {
    if (isErrorObjectEmpty()) {
      const createEffect: CreateEffect = {
        effectName,
        parentId: parentEventId as EventId,
        newEffect: {
          operation,
          value,
          type,
          target,
          description,
        } as Effect,
        activated,
      };
      dispatch('createEffect', createEffect);
    }
  };

</script>
<div id="event-creation-form">
  <h2>Create a new effect from parent: </h2>
  {#if isChoiceToDisplayId(parentId)}
    <h3>choice: {parentId.get()}</h3>
  {:else}
    <h3>{parentId.value}</h3>
  {/if}
  <form on:submit|preventDefault={() => validateAndSubmitOnCreateEvent(parentId, effectName, description, operation, target,value,type,activated)}>
    <Input
      type="text"
      label="effect name"
      placeholder="your-effect-name"
      bind:value={effectName}
      error={errors.effectName}
    />
    <Input
      type="text"
      label="description"
      placeholder="desc"
      bind:value={description}
      error={errors.description}
    />
    <Select
      label="operation"
      bind:value={operation}
    >
      <option value="add">add</option>
      <option value="substract">substract</option>
    </Select>
    <Select
      label="target"
      bind:value={target}
    >
      <option value="population">population</option>
      <option value="ecology">ecology</option>
      <option value="money">money</option>
    </Select>
    <Input
      type="number"
      label="value"
      placeholder="3"
      bind:value={value}
      error={errors.value}
    />
    <Select
      label="type"
      bind:value={type}
    >
      <option value="instant">instant</option>
      <option value="permanent">permanent</option>
    </Select>
    <Checkbox
      label="activated"
      bind:value={activated}
    >
      <option value="true">true</option>
      <option value="false">false</option>
    </Checkbox>
    <button type="submit">create effect</button>
  </form>
</div>
<style>
  #event-creation-form button {
    text-align: center;
  }
</style>
