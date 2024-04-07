<script lang="ts">
  export let iconClass: string;
</script>

<svg
  class={iconClass}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 -3 64 67"
  id="heart"
  width="100"
  height="100"
>
  <defs>
    <linearGradient id="liked-gradient">
      <stop offset="0%" stop-color="rgb(255, 0, 144)" />
      <stop offset="100%" stop-color="purple" />
    </linearGradient>
  </defs>
  <path
    d="M32.76 55.33a1.48 1.48 0 0 1-1.52 0C29.96 54.58-.17 36.72 5.8 20.22c3.05-8.41 8.28-10.93 12.13-11.57A17.159 17.159 0 0 1 32 13.24a17.159 17.159 0 0 1 14.07-4.59c3.85.64 9.08 3.16 12.13 11.57 5.97 16.5-24.16 34.36-25.44 35.11Z"
    stroke-width="6px"
  ></path>
</svg>
