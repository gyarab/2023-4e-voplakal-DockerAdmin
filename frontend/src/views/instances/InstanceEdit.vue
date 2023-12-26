<template>
  <div>
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
                  </CCol>
                  <CCol :sm="3" class="d-md-block">
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                      <CButton class="float-end" color="danger" variant="ghost" @click="() => this.$refs.deleteModal.data.show = true">Delete</CButton>

                      <CButton v-if="data.status.substring(0, 2) === 'Up'" class="float-end" color="dark" variant="ghost" size="lg" @click="stopInstance">Stop</CButton>
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
                            <!-- <CTableRow>
                              <CTableHeaderCell scope="row">Tag</CTableHeaderCell>
                              <CTableDataCell><b>aaaa</b></CTableDataCell>
                            </CTableRow> -->
                          </CTableBody>
                        </CTable>

                      </CCardBody>
                      <!-- <CCardFooter>                        <CRow>                          <CCol> </CCol>                        </CRow>                      </CCardFooter> -->
                    </CCard>

                    <CCard style="margin-bottom: 25px;">
                      <CCardBody>
                        <CCardTitle>Image</CCardTitle>
                        <CTable>
                          <CTableBody>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Repository</CTableHeaderCell>
                              <CTableDataCell>{{ image.repository }}</CTableDataCell>
                            </CTableRow>
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
                        </CTable>

                      </CCardBody>
                      <!-- <CCardFooter>                        <CRow>                          <CCol> </CCol>                        </CRow>                      </CCardFooter> -->
                    </CCard>

                    <CCard style="margin-bottom: 25px;">
                      <CCardHeader>
                        <h4 class="card-title">Resources limits</h4>
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
                        <!-- <div class="small text-body-secondary">This script run once when new app instance is created.</div> -->
                      </CCardHeader>
                      <CCardBody>
                        <CTable>
                          <CTableBody>
                            <CTableRow v-for="(val, key ) in stats">
                              <CTableHeaderCell scope="row">{{ key }}</CTableHeaderCell>
                              <CTableDataCell>{{ val }}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="row">Status</CTableHeaderCell>
                              <CTableDataCell>{{ data.status }}</CTableDataCell>
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
  </div>



  <!-- MODALS -->
  <MyModal ref="deleteModal" :title="'Remove app ' + data.name + '?'" :on_submit="deleteApp">
    This will not remove your docker image.
    <template #footer>
      <CButton color="secondary" @click="() => this.$refs.deleteModal.data.show = false">
        Storno
      </CButton>
      <CButton color="danger" type="submit">Smazat</CButton>
    </template>
  </MyModal>
</template>


<script>
import { reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import MyModal from '../../components/MyModal.vue';



export default {
  name: "AppEdit",
  components: {
    MyModal
  },
  props: {
    id: {
      type: String
    },
  },
  setup(props) {
    const isNew = !!props.id;
    const store = useStore();

    //todo load item data app_id: props.id
    store.dispatch("getInstances")
    const data = computed(() => store.state.instances[0]);


    const deleteApp = () => {
      console.log("deleted");
      window.showToast({
        content: 'Deleted',
        color: 'success'
      })
    }
    const saveChanges = () => {
      console.log("save");
      window.showToast({
        content: 'Saved',
        color: 'success'
      })
    }
    const nav = ref('init');

    const startInstance = () => {
      console.log("star");
    }
    const stopInstance = () => {
      console.log("stop");
    }

    const editFormModal = reactive({
      show: false
    })

    const stats = ref({ BlockIO: "108MB / 59.4MB", CPUPerc: "0.00%", Container: "a85f49b55397", ID: "a85f49b55397", MemPerc: "4.43%", MemUsage: "87.75MiB / 1.936GiB", Name: "m-test1", NetIO: "2.44GB / 510MB", PIDs: "24", })

    setTimeout(() => {
      for (const p in stats.value) {
        console.log(`${p}: ${stats.value[p]}`);
      }
      console.log();
    }, 1000)

    return {
      isNew, data, deleteApp, saveChanges, stats, nav, editFormModal, image: {
        repository: "biobrein",
        tag: 'latest',
        image_id: '08af2227f359',
        created: '7 weeks ago',
        size: '340 MB',
      },
      stopInstance, startInstance
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