<template>
  <div class="tools-list">
    <h2>Kali Tools (scaffold)</h2>
    <ul>
      <li v-for="tool in tools" :key="tool.id">
        <router-link :to="`/tools/${tool.id}`">{{ tool.name }}</router-link>
        - <small>{{ tool.risk }}</small>
        <p>{{ tool.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'ToolsList',
  setup() {
    const tools = ref([] as any[]);
    onMounted(async () => {
      try {
        const res = await fetch('/api/tools');
        tools.value = await res.json();
      } catch (e) {
        console.error(e);
      }
    });

    return { tools };
  }
});
</script>

<style scoped>
.tools-list { padding: 1rem; }
</style>
