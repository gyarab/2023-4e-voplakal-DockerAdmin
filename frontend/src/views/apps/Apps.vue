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
              <CCol :sm="7" class="  d-md-block">
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

                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CSpinner v-if="!appsData" />
                      <CTableRow v-for="app in appsData" :key="app.id">
                        <AppLi :rowData="app"></AppLi>
                      </CTableRow>
                    </CTableBody>
                  </CTable>

                </CCol>
              </CCol>
            </CRow>
          </CCardBody>

        </CCard>
      </CCol>
    </CRow>
  </div>

  <MyModal ref="createModal" title="Select docker image repository" :on_submit="() => createApp(selectedImage, newAppName)">
    <CSpinner v-if="!dockerImagesRepos" />
    <CFormLabel for="staticEmail" class="col-sm-2 col-form-label">App name</CFormLabel>
    <CFormInput v-model="newAppName" type="text" placeholder="Enter new app name" style="margin-bottom: 10px;" required></CFormInput>
    <CFormSelect v-model="selectedImage" required>
      <option>Choose a docker image repository</option>
      <option v-for="repo in dockerImagesRepos" :value="repo">{{ repo }}</option>
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
import { REST } from '../../API';

export default {
  name: "Apps",
  components: {
    AppLi,
    MyModal
  },
  setup() {
    //     REPOSITORY     TAG         IMAGE ID       CREATED        SIZE
    // role_mgr3      latest      08af2227f359   6 weeks ago    239MB
    const store = useStore()
    const router = useRouter()
    store.dispatch("getApps");
    const appsData = computed(() => store.state.apps)


    const dockerImagesRepos = ref([]);
    const createModal = ref();
    const createAppDialogOpen = async () => {
      createModal.value.data.show = true;
      dockerImagesRepos.value = await store.dispatch("getRepos")
    }
    const createApp = async (repoImageName, newAppName) => {
      let id = await store.dispatch("createApp", { repoImageName, newAppName })
      router.push("/app-edit/" + id)
    }

    return {
      icon, appsData, selectedImage: ref(), newAppName: ref(), createApp, createAppDialogOpen, dockerImagesRepos, createModal
    }
  }
}
</script>
