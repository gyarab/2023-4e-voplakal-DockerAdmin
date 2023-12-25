<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="5">
                <h4 id="traffic" class="card-title mb-0">Apps</h4>
                <div class="small text-body-secondary" style="margin-top: 7px;">All your <b>Docker images</b> managed by this administration system.</div>
              </CCol>
              <CCol :sm="7" class="d-none d-md-block">
                <router-link to="/app-edit">
                  <CButton size="lg" color="primary" class="float-end">
                    <CIcon size="xl" :icon="icon.cilPlus" />
                    Create
                  </CButton>
                </router-link>
              </CCol>
            </CRow>
            <br>
            <CRow>
              <CCol>
                <CCol :md="12">

                  <CTable striped hover>
                    <CTableHead>
                      <CTableRow color="dark">
                        <CTableHeaderCell scope="col">Repository</CTableHeaderCell>
                        <CTableHeaderCell scope="col">tag</CTableHeaderCell>
                        <CTableHeaderCell scope="col">created</CTableHeaderCell>
                        <CTableHeaderCell scope="col">size</CTableHeaderCell>
                        <CTableHeaderCell scope="col">image id</CTableHeaderCell>
                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow v-for="app in appsData" :key="app.id">
                        <AppLi :rowData="app"></AppLi>
                      </CTableRow>
                    </CTableBody>
                  </CTable>

                </CCol>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol>
                <div class="text-body-secondary">Test</div>
                <div class="fw-semibold text-truncate">29.703 Users (40%)</div>
                <CProgress class="mt-2" color="success" thin :precision="1" :value="40" />
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import AppLi from './AppLi.vue';
import { computed, reactive } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "Apps",
  components: {
    CIcon,
    AppLi
  },
  setup() {
    //     REPOSITORY     TAG         IMAGE ID       CREATED        SIZE
    // role_mgr3      latest      08af2227f359   6 weeks ago    239MB
    const store = useStore()
    const appsData = computed(() => store.state.apps)
    return {
      icon, appsData
    }
  }
}
</script>
