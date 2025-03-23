<script setup lang="ts">
defineProps({
  name: String,
});

</script><template>
  <img :src="`@/assets/icons/${name}.svg`" :alt="name" />
</template>
