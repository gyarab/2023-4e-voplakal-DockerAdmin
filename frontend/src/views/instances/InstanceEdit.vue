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
                    <div class="small text-body-secondary" style="margin-top: 7px;">Editing app instance belonging to a client.</div>
                    <div class="small text-body-secondary">id: {{ data.id }}</div>

                  </CCol>
                  <CCol :sm="3" class="d-md-block">
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                      <CButton class="float-end" color="danger" variant="ghost" @click="() => this.$refs.deleteModal.data.show = true">Delete</CButton>

                      <CButton v-if="!data.status" class="float-end" color="primary" variant="ghost" size="lg">
                        <CSpinner />
                      </CButton>
                      <CButton v-else-if="data.status.substring(0, 2) === 'Up'" class="float-end" color="dark" variant="ghost" size="lg" @click="stopInstance">Stop</CButton>
                      <CButton v-else class="float-end" color="primary" variant="ghost" size="lg" @click="startInstance">Start</CButton>

                      <CButton class="float-end" color="success" size="lg" @click="saveChanges">Save</CButton>
                    </div>
                  </CCol>

                </CRow>
                <br>
                <CRow>
                  <CCol :sm="12" :lg="6" :xl="5" :xxl="3">

                    <CCard style="margin-bottom: 25px;">
                      <CCardBody>
                        <CCardTitle>User</CCardTitle>
                        <CTable>
                          <CTableBody>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Email</CTableHeaderCell>
                              <CTableDataCell>{{ data.client }}</CTableDataCell>
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
                              <CTableDataCell>{{ app.name }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Repository</CTableHeaderCell>
                              <CTableDataCell>{{ app.repository }}</CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                        <CCardTitle>Image</CCardTitle>
                        <CTable>
                          <CTableBody v-if="image">
                            <CTableRow>
                              <CTableHeaderCell scope="row">Tag</CTableHeaderCell>
                              <CTableDataCell>{{ image.tag }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Created</CTableHeaderCell>
                              <CTableDataCell>{{ image.created }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Size</CTableHeaderCell>
                              <CTableDataCell>{{ image.size }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Image ID</CTableHeaderCell>
                              <CTableDataCell>{{ data.image_id }}</CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                          <CTableBody v-else>
                            Image not foud
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                      <CCardFooter>
                        <CCardTitle>Change version (tag)</CCardTitle>
                        <div class="flex-container">
                          <CFormSelect v-model="actionUpgradeTag" size="sm" class="mb-3">
                            <option>Select</option>
                            <option v-for="image in app.images" :value="image.tag">{{ image.tag }}</option>
                          </CFormSelect>
                          <CButton color="primary" size="sm" @click="upgradeTag(actionUpgradeTag)">OK</CButton>
                        </div>
                      </CcardFooter>
                    </CCard>
                    <CCard style="margin-bottom: 25px;">
                      <CCardHeader>
                        <h4 class="card-title mb-0">Resources limits</h4>
                      </CCardHeader>
                      <CCardBody>
                        <CTable>
                          <CTableBody>
                            <CTableRow>
                              <CTableHeaderCell scope="row">CPU</CTableHeaderCell>
                              <CTableDataCell class="flex-container">
                                <CFormInput type="number" :min="0" :max="100" v-model="data.limits.cpu" style="width: fit-content;"></CFormInput>
                                <h4>%</h4>
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">RAM</CTableHeaderCell>
                              <CTableDataCell class="flex-container">
                                <CFormInput type="number" :min="0" :max="100" v-model="data.limits.ram" style="width: fit-content;"></CFormInput>
                                <h4>%</h4>
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">SWAP</CTableHeaderCell>
                              <CTableDataCell>{{ data.limits.swap }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Disk</CTableHeaderCell>
                              <CTableDataCell>{{ data.limits.disk }}</CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                    </CCard>
                  </CCol>

                  <CCol>

                    <CCard style="margin-bottom: 25px;">
                      <CCardHeader>
                        <h4 class="card-title">Statistics</h4>
                      </CCardHeader>
                      <CCardBody>
                        <CTable>
                          <CTableBody>
                            <CTableRow v-if="data.status">
                              <CTableHeaderCell scope="row">Status</CTableHeaderCell>
                              <CTableDataCell>{{ data.status }}</CTableDataCell>
                            </CTableRow>
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
                              <CTableDataCell>
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
import { reactive, ref, computed, watch } from 'vue';
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
    store.dispatch("getInstances")
    if (!store.state.apps) store.dispatch("getApps");
    const data = computed(() => store.state.instances?.find(i => i.id === props.id));
    const app = computed(() => store.state.apps?.find(a => a.id === data.value.app_id))
    const image = computed(() => app.value.images?.find(i => i.image_id === data.value.image_id))

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
    const startInstance = () => {
      data.value.status = undefined
      store.dispatch("instanceStart", data.value.id)
    }
    const stopInstance = () => {
      data.value.status = undefined
      store.dispatch("instancesStop", [data.value.id])
    }

    const upgradeTag = (tag) => {
      store.dispatch("instancesUpgrade", {
        ids: [data.value.id],
        tag
      })
    }

    const stats = ref(null);
    watch(data, data => store.dispatch("getInstanceStats", data.container_id).then(v => stats.value = v));


    return {
      data, deleteInstance, saveChanges, stats, image, stopInstance, startInstance, app, actionUpgradeTag: ref(), upgradeTag,
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
</style>