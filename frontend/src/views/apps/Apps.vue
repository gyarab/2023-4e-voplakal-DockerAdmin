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
                <CButton size="lg" color="primary" class="float-end" @click="createAppDialogOpen">
                  <CIcon size="xl" :icon="icon.cilPlus" />
                  Create
                </CButton>
              </CCol>
            </CRow>
            <br>
            <CRow>
              <CCol>
                <CCol :md="12">

                  <CTable striped hover>
                    <CTableHead>
                      <CTableRow color="dark">
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">repository</CTableHeaderCell>
                        <CTableHeaderCell scope="col">images</CTableHeaderCell>

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

  <MyModal ref="createModal" title="Select docker image repository" :on_submit="() => createApp(selectedImage)">
    <CSpinner v-if="!dockerImages.length" />

    <CFormSelect v-model="selectedImage">
      <option>Choose a docker image repository</option>
      <option v-for="image in dockerImages" :value="image">{{ image }}</option>
    </CFormSelect>
    <div class="small text-body-secondary">
      To use some app in this system you have to dockerize the app firstly.
    </div>

  </MyModal>
</template>

<script>
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import { computed, reactive, ref } from 'vue';
import AppLi from './AppLi.vue';
import { useStore } from 'vuex';
import MyModal from '../../components/MyModal.vue';
import { useRouter } from 'vue-router';

export default {
  name: "Apps",
  components: {
    CIcon,
    AppLi,
    MyModal
  },
  setup() {
    //     REPOSITORY     TAG         IMAGE ID       CREATED        SIZE
    // role_mgr3      latest      08af2227f359   6 weeks ago    239MB
    const store = useStore()
    const router = useRouter()
    const appsData = computed(() => store.state.apps)

    const dockerImages = ref([]);
    const createModal = ref();
    const createAppDialogOpen = () => {
      createModal.value.data.show = true;
      setTimeout(() => dockerImages.value = ["Bio-brein", "DEH", "WordPress"], 1500)
      //dockerImages = api call
    }
    const createApp = async (imageRepo) => {
      let id = await store.dispatch("createApp", imageRepo)
      router.push("/app-edit/" + id)

    }

    return {
      icon, appsData, selectedImage: ref(), createApp, createAppDialogOpen, dockerImages, createModal
    }
  }
}
</script>
