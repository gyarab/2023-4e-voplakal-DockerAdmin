<template>
  <div v-if="!data">
    <CSpinner />Loading instance data
  </div>
  <div v-else-if="!app">Can not find app</div>
  <div v-else>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="12">
                <CRow>
                  <CCol :sm="9">
                    <h4 class="card-title mb-0">{{ data.name }}</h4>
                    <div class="small text-body-secondary" style="margin-top: 7px;">Editing app instance belonging to a client.
                    <br><a v-if="app.domain" target="_blank" :href="'https://' + data.name+ '.' + app.domain">{{ 'https://' + data.name+ '.' + app.domain }}</a></div>
                    <div class="small text-body-secondary">id: {{ data.id }}</div>

                  </CCol>
                  <CCol :sm="3" class="d-md-block">
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                      <CButton class="float-end" color="danger" variant="ghost" @click="() => this.$refs.deleteModal.data.show = true">Delete</CButton>

                      <CButton v-if="!stats?.State" class="float-end" color="primary" variant="ghost" size="lg">
                        <CSpinner />
                      </CButton>
                      <CButton v-else-if="stats.State === 'running'" class="float-end" color="dark" variant="ghost" size="lg" @click="stopInstance">Stop</CButton>
                      <CButton v-else class="float-end" color="primary" variant="ghost" size="lg" @click="startInstance">Start</CButton>

                      <CButton class="float-end" color="success" size="lg" @click="saveChanges">Save</CButton>
                    </div>
                  </CCol>

                </CRow>
                <br>
                <CRow>
                  <CCol :sm="12" :md="12" :lg="7" :xl="6" :xxl="5" class="w-break">
                    <CCard style="margin-bottom: 25px;">
                      <CCardBody>
                        <CCardTitle>User</CCardTitle>
                        <CTable>
                          <CTableBody>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Email</CTableHeaderCell>
                              <CTableDataCell>{{ data.client.email }}</CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                    </CCard>
                    <CCard style="margin-bottom: 25px;">
                      <CCardBody>
                        <CCardTitle>App</CCardTitle>
                        <CTable>
                          <CTableBody>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Name</CTableHeaderCell>
                              <CTableDataCell class="w-break">{{ app.name }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Repository</CTableHeaderCell>
                              <CTableDataCell>{{ app.repository }}</CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                        <CCardTitle>Image</CCardTitle>
                        <CTable>
                          <CTableBody v-if="data.image">
                            <!-- <CTableRow v-for="( prop, key ) in  data.image " :key="prop.ID">
                              <CTableHeaderCell scope="row">{{ key }}</CTableHeaderCell>
                              <CTableDataCell>{{ prop }}</CTableDataCell>
                            </CTableRow> -->
                            <CTableRow>
                              <CTableHeaderCell scope="row">Tag</CTableHeaderCell>
                              <CTableDataCell active><b>{{ data.image.Tag }}</b></CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Created</CTableHeaderCell>
                              <CTableDataCell>{{ data.image.CreatedAt }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Size</CTableHeaderCell>
                              <CTableDataCell>{{ data.image.Size }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Image ID</CTableHeaderCell>
                              <CTableDataCell>{{ data.image.ID }}</CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                          <CTableBody v-else>
                            <h5>
                              <CBadge color="danger">Image not foud</CBadge>
                            </h5>
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                      <CCardFooter>
                        <CCardTitle>Change version (tag)</CCardTitle>
                        <div class="flex-container">
                          <CFormSelect v-model="actionUpgradeImage" size="sm" class="mb-3">
                            <option :value="null">Select</option>
                            <option v-for="image in app.images" :value="image.ID">{{ image.Tag }}</option>
                          </CFormSelect>
                          <CButton color="primary" size="sm" @click="upgradeTag(actionUpgradeImage)" :disabled="actionUpgradeImage ? null : true">OK</CButton>
                        </div>
                      </CcardFooter>
                    </CCard>
                    <CCard style="margin-bottom: 25px;">
                      <CCardHeader>
                        <h4 class="card-title mb-0">Resources limits</h4>
                        <div class="small text-body-secondary" style="margin-top: 7px;">deactivate by <b>-1</b></div>
                      </CCardHeader>
                      <CCardBody>
                        <CTable>
                          <CTableBody class="input_with">
                            <CTableRow>
                              <CTableHeaderCell scope="row">CPU shares</CTableHeaderCell>
                              <CTableDataCell class="flex-container">
                                <CFormInput type="number" v-model="data.limits.cpu" style="width: fit-content;"></CFormInput>
                                <div>(priority), default 1024 <code>--cpu-shares</code></div>
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">RAM</CTableHeaderCell>
                              <CTableDataCell class="flex-container">
                                <CFormInput type="number" v-model="data.limits.ram" style="width: fit-content;"></CFormInput>
                                <div style="margin-top: 4px; margin-left: 3px; font-size: large;">MB <code>--memory-reservation</code></div>
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">SWAP</CTableHeaderCell>
                              <CTableDataCell class="flex-container">
                                <CFormInput type="number" v-model="data.limits.swap" style="width: fit-content;"></CFormInput>
                                <div style="margin-top: 4px; margin-left: 3px; font-size: large;">MB <code>--memory-swap</code></div>
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Disk</CTableHeaderCell>
                              <CTableDataCell class="flex-container">
                                <CFormInput type="number" v-model="data.limits.disk" style="width: fit-content;"></CFormInput>
                                <div style="margin-top: 4px; margin-left: 3px; font-size: large;">(priority) default 500<code>--blkio-weight</code></div>
                              </CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                    </CCard>
                  </CCol>

                  <CCol class="w-break">
                    <CCard style="margin-bottom: 25px;">
                      <CCardHeader>
                        <CRow>
                          <CCol :sm="5">
                            <h4 class="card-title">Statistics</h4>
                          </CCol>
                          <CCol :sm="7" class="  d-md-block">
                            <h4>
                              <CSpinner v-if="!stats"></CSpinner>
                              <CBadge v-else :color="stats.Status?.substring(0, 2) === 'Up' ? 'success' : 'secondary'" class="float-end"> {{ stats.Status }} </CBadge>
                            </h4>
                          </CCol>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <CTable>
                          <CTableBody>
                            <!-- <div :js="delete stats.Status"></div> -->
                            <CSpinner v-if="!stats" />
                            <CTableRow v-for="(val, key ) in stats">
                              <CTableHeaderCell scope="row">{{ key }}</CTableHeaderCell>
                              <CTableDataCell>{{ val }}</CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                      <CCardFooter>
                      </CCardFooter>
                    </CCard>


                    <CCard>
                      <CCardHeader>
                        <CRow>
                          <h4 class="card-title">Dates</h4>
                        </CRow>
                      </CCardHeader>
                      <CCardBody>
                        <CTable>
                          <CTableBody>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Created</CTableHeaderCell>
                              <CTableDataCell>
                                <CFormInput type="date" :value="data.created_on" disabled />
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Expiry date</CTableHeaderCell>
                              <CTableDataCell :color="isExpired(data.expiry_date) ? 'danger' : ''">
                                <CFormInput type="date" v-model="data.expiry_date" />
                              </CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                      <CCardFooter>
                      </CCardFooter>
                    </CCard>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>



    <!-- MODALS -->
    <MyModal ref="deleteModal" :title="'Delete instance ' + data.name + '?'" :on_submit="deleteInstance">
      All data belonging to this instance will be deleted. Are you sure you want to delete this instance? It is not reversible.
      <template #footer>
        <CButton color="secondary" @click="() => this.$refs.deleteModal.data.show = false">
          Storno
        </CButton>
        <CButton color="danger" type="submit">Delete</CButton>
      </template>
    </MyModal>

  </div>
</template>


<script>
import { reactive, ref, computed, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
import MyModal from '../../components/MyModal.vue';
import { CSpinner, CTableBody } from '@coreui/vue';



export default {
  name: "AppEdit",
  components: {
    MyModal,
    CSpinner,
    CTableBody
  },
  props: {
    id: {
      type: String
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    //todo load item data app_id: props.id
    if (!store.state.instances) store.dispatch("getInstances")
    if (!store.state.apps) store.dispatch("getApps");
    const data = computed(() => {
      let data = store.state.instances?.find(i => i.id === props.id);
      if (data) loadStats(data);
      return data;
    });
    const app = computed(() => store.state.apps?.find(a => a.id === data.value.app_id))


    const stats = ref(null);
    const loadStats = (data) => store.dispatch("getInstanceStats", data.container_id).then(v => stats.value = v)
    // setInterval(() => console.log(store.state.instances?.find(i => i.id === props.id)), 1000);

    // {
    //   repository: "biobrein",
    //   tag: 'latest',
    //   image_id: '08af2227f359',
    //   created: '7 weeks ago',
    //   size: '340 MB',
    // }


    const deleteInstance = async () => {
      store.dispatch("instancesDelete", [data.value.id])
      router.push("/instances")
    }
    const saveChanges = async () => {
      store.dispatch("instanceSave", data.value)
    }
    const keyEvent = (e) => {
      if (e.ctrlKey && e.key === 's') {
        // Prevent the Save dialog to open
        e.preventDefault();
        // Place your code here
        saveChanges();
        console.log("ctrl+S");
      }

    }
    document.body.addEventListener("keydown", keyEvent, true);
    onUnmounted(() => document.body.removeEventListener("keydown", keyEvent, true));

    const startInstance = () => {
      stats.value.State = undefined
      store.dispatch("instanceStart", data.value.container_id)
    }
    const stopInstance = () => {
      stats.value.State = undefined
      store.dispatch("instancesStop", [data.value.container_id])
    }

    const upgradeTag = (imageId) => {
      store.dispatch("instancesUpgrade", {
        ids: [data.value.id],
        imageId
      })
    }
    return {
      data, deleteInstance, saveChanges, stats, stopInstance, startInstance, app, actionUpgradeImage: ref(), upgradeTag, isExpired: (date) => {
        let d = new Date(date);
        return d.getTime() < new Date().getTime();
      }
    }
  },

}

</script>
<style>
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}

.w-break td {
  word-break: break-word;
}

.input_with input {
  width: 82px !important;
}

.red {
  color: red !important;
}
</style>