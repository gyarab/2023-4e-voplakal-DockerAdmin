<template>
  <router-view />

  <CToaster placement="top-end" visible style="margin: 20px;">
    <!-- <CToast v-for="(toast, index) in toasts" visible :delay='3000'>
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">Ahoj</span>
        <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>
        {{ toast.content }}
      </CToastBody>
    </CToast> -->
    <CToast v-for="(toast, index) in toasts" :color="toast.color" class="text-white align-items-center" visible>
      <div class="d-flex">
        <CToastBody>{{ toast.content }}</CToastBody>
        <CToastClose class="me-2 m-auto" white />
      </div>
    </CToast>
  </CToaster>
</template>
<script>
import { onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import { useColorModes } from '@coreui/vue'

let toasts = ref([]);
export default {
  setup() {
    const { isColorModeSet, setColorMode } = useColorModes(
      'coreui-free-vue-admin-template-theme',
    )
    const store = useStore()

    onBeforeMount(() => {
      const urlParams = new URLSearchParams(window.location.href.split('?')[1])
      const theme =
        urlParams.get('theme') &&
        urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
      if (theme) {
        setColorMode(theme)
        return
      }

      if (isColorModeSet()) {
        return
      }

      setColorMode(store.state.theme)
    })
    return { toasts }
  },
}
window.showToast = (p) => {
  // {
  //   content: 'Lorem ipsum dolor cet emit',
  //     color: 'success'
  // }
  toasts.value.push(
    p
  )
}
</script>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
</style>
