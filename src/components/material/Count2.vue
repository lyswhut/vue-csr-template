<template>
  <div>
    <p>{{count}}</p>
    <button @click="increase">increase</button>
    <button @click="decrease">decrease</button>
  </div>
</template>

<script>
import useCount from '@/hooks/useCount'
export default {
  setup() {
    return useCount()
  },
}
</script>

<style>

</style>
