<template lang="pug">
div
  h2 About page
  material-btn
  div
    p {{count}}
    button(@click="increase") increase
    button(@click="decrease") decrease
</template>

<script>
import { computed, unref } from 'vue'
import useCount from '../hooks/useCount'
export default {
  setup() {
    const { count, increase, decrease } = useCount()

    const newCount = computed(() => {
      return unref(count) * 2
    })

    return {
      count: newCount,
      increase,
      decrease,
    }
  },
}
</script>
