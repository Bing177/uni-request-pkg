<template>
  <view></view>
</template>

<script>
import request from '../../utils/request'
export default {
    onLoad() {
        try {
            const res = request.get('/api/info')
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
}
</script>

<style>

</style>