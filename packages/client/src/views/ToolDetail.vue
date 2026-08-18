<template>
  <div class="tool-detail">
    <h2>{{ tool?.name || 'Tool' }}</h2>
    <p v-if="tool">{{ tool.description }}</p>

    <div v-if="tool">
      <form @submit.prevent="run">
        <div v-for="arg in tool.args" :key="arg.name">
          <label :for="arg.name">{{ arg.name }} <small>{{ arg.description }}</small></label>
          <input v-model="form[arg.name]" :id="arg.name" />
        </div>
        <button type="submit">Run (mock)</button>
      </form>

      <div v-if="job">
        <h3>Job</h3>
        <pre>{{ job }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'ToolDetail',
  setup() {
    const route = useRoute();
    const tool = ref<any>(null);
    const form = ref<Record<string, any>>({});
    const job = ref(null);

    onMounted(async () => {
      const id = route.params.id;
      const res = await fetch('/api/tools');
      const list = await res.json();
      const found = list.find((t: any) => t.id === id);
      tool.value = found;
      if (found) {
        found.args.forEach((a: any) => { form.value[a.name] = a.default || ''; });
      }
    });

    async function run() {
      if (!tool.value) return;
      const res = await fetch(`/api/tools/${tool.value.id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
      const data = await res.json();
      job.value = { request: data };
      // poll for job
      if (data.jobId) {
        const poll = setInterval(async () => {
          const r = await fetch(`/api/tools/jobs/${data.jobId}`);
          const j = await r.json();
          job.value = j;
          if (j.status === 'completed' || j.status === 'failed') clearInterval(poll);
        }, 1000);
      }
    }

    return { tool, form, run, job };
  }
});
</script>

<style scoped>
.tool-detail { padding: 1rem; }
</style>
