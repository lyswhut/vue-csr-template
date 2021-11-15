<template>
  <div>
    <p>{{count}}</p>
    <button @click="increase">increase</button>
    <button @click="decrease">decrease</button>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)

    const increase = () => {
      count.value++
    }
    const decrease = () => {
      count.value--
    }

    return {
      count,
      increase,
      decrease,
    }
  },
}
</script>

<style>

</style>
