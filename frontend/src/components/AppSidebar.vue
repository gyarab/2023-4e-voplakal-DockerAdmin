<template>
  <CSidebar class="border-end" colorScheme="dark" position="fixed" :unfoldable="sidebarUnfoldable" :visible="sidebarVisible" @visible-change="(event) =>
    $store.commit({
      type: 'updateSidebarVisible',
      value: event,
    })
    ">
    <CSidebarHeader class="border-bottom" style="overflow: hidden;">
      <CSidebarBrand>

        <img src="@/assets/images/blue.png" width="210px" class="brand-small">
        <!-- logo from https://www.brandcrowd.com/maker/logo/9ac932ad-44a7-4e65-9a35-1386fd1f048e/draft/66e15945-c95d-4844-a267-6acf0175c24c?savedDraft=True -->

      </CSidebarBrand>
      <CCloseButton class="d-lg-none" dark @click="$store.commit('toggleSidebar')" />
    </CSidebarHeader>
    <AppSidebarNav :session="session" />
    <CSidebarFooter class="border-top">
      <CSidebarToggler class="d-none  d-lg-flex" @click="$store.commit('toggleUnfoldable')" />
    </CSidebarFooter>
  </CSidebar>
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { AppSidebarNav } from './AppSidebarNav'
export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  setup() {
    const store = useStore()

    return {
      sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
      sidebarVisible: computed(() => store.state.sidebarVisible),
      session: computed(() => store.state.session)
    }
  },
}
</script>
<style>
.sidebar-narrow-unfoldable:not(:hover) .brand-small {
  position: relative;
  left: 70px;
  zoom: 0.7;
}
</style>