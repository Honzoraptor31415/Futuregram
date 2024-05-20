<script lang="ts">
  import RedFormStar from "./RedFormStar.svelte";
  import HideIcon from "./icons/HideIcon.svelte";
  import ShowIcon from "./icons/ShowIcon.svelte";

  export let id: string;
  export let placeholder: string;
  export let wrpClass = "";
  export let type = "text";
  export let required = false;
  export let starClass = "";
  export let initLabel: string;
  export let inputClass = "";
  export let labelClass = "";
  export let label: string;
  export let value = "";
  export let isValid: boolean;

  let pwdBtnType = "password";

  function setShowPassword() {
    if (pwdBtnType === "password") {
      pwdBtnType = "text";
    } else {
      pwdBtnType = "password";
    }
    console.log(pwdBtnType);
  }

  const handleInput = (e: any) => {
    value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
  };

  $: console.log(label, initLabel);
</script>

<div class={`form-element ${wrpClass}`}>
  <label for={id} class={`${labelClass} ${label !== "" ? "form-error" : ""}`}>
    {#if isValid}
      {initLabel}
      {#if required}
        <RedFormStar {starClass} />
      {/if}
    {:else}
      {label}
    {/if}
  </label>
  {#if type === "text"}
    <input
      type="text"
      {id}
      bind:value
      class={`user-input user-input-text ${inputClass} ${label !== "" ? "form-error-input" : ""}`}
      {placeholder}
    />
  {:else if type === "password"}
    <div
      class={`user-input-text password-input-wrp ${label !== "" ? "form-error-input" : ""}`}
    >
      <input
        type={pwdBtnType}
        {id}
        on:input={handleInput}
        class="password-input no-style"
        {placeholder}
      />
      {#if value}
        <button
          type="button"
          class="button-element no-style before-hover-anim password-show-button rounded"
          on:click={setShowPassword}
        >
          {#if pwdBtnType === "text"}
            <HideIcon iconClass="image-height-30" />
          {:else}
            <ShowIcon iconClass="image-height-30" />
          {/if}
        </button>
      {/if}
    </div>
  {:else if type === "textarea"}
    <textarea
      bind:value
      {id}
      {placeholder}
      class={`user-input user-input-text ${inputClass} ${label !== "" ? "form-error-input" : ""}`}
    ></textarea>
  {/if}
</div>
