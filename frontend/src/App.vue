<template>
  <div v-if="!error && !session">Loading</div>
  <div v-if="error && !session">LOGIN</div>
  <router-view v-if="!error && session" />

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
  <CModal :visible="!!apiErrors.length" @close="() => { apiErrors.length = 0 }">
    <CModalHeader>
      <CModalTitle>
        <!-- {{ title }} -->
      </CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div v-for="err in apiErrors">
        <b> {{ err.name }}: </b> {{ err.message }}
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { apiErrors.length = 0 }">
        Close
      </CButton>
      <CButton color="primary" type="submit" @click="reload">Reload</CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
import { onBeforeMount, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useColorModes } from '@coreui/vue'

let toasts = ref([]);
window.apiErrors = ref([]);
export default {
  components: {
  },
  setup() {
    const { isColorModeSet, setColorMode } = useColorModes(
      'coreui-free-vue-admin-template-theme',
    )
    const router = useRouter();
    window.router = router;
    const store = useStore()
    store.dispatch("getApps")
    store.dispatch("getInstances")
    store.dispatch('getSession');

    const error = computed(() => store.state.error)
    const session = computed(() => store.state.session)


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
    return { toasts, apiErrors, reload: () => location.reload(), error, session }
  },
}
window.showToast = (p) => {
  // {
  //   content: 'Lorem ipsum dolor cet emit',
  //     color: 'success'
  // }
  if (typeof p === 'string') p = {
    content: p,
    color: 'success'
  }
  toasts.value.push(
    p
  )
}
window.router;
</script>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
</style>
