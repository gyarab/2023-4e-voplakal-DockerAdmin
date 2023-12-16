<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="5">
                <h4 class="card-title mb-0"> {{ isNew ? "Add app" : "" }}{{ data.name }}</h4>
                <div class="small text-body-secondary" style="margin-top: 7px;">Editing app belonging to a docker image.</div>
              </CCol>
              <CCol :sm="7" class="d-none d-md-block">
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton class="float-end" color="success" size="lg" @click="saveChanges">Save</CButton>
                  <CButton class="float-end" color="danger" variant="ghost" @click="() => this.$refs.deleteModal.data.show = true">Delete</CButton>
                </div>
              </CCol>

            </CRow>
            <br>
            <CRow>
              <CCol :sm="12" :lg="5" :xl="4" :xxl="3">
                <CCard>
                  <CCardBody>
                    <CTable>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Repository</CTableHeaderCell>
                          <CTableDataCell>{{ data.repository }}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Tag</CTableHeaderCell>
                          <CTableDataCell>{{ data.tag }}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Created</CTableHeaderCell>
                          <CTableDataCell>{{ data.created }}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Size</CTableHeaderCell>
                          <CTableDataCell>{{ data.size }}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Image ID</CTableHeaderCell>
                          <CTableDataCell>{{ data.image_id }}</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>

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

              <CCol>
                <CCard>
                  <CCardHeader>
                    <h4 class="card-title">Init script</h4>
                    <div class="small text-body-secondary">This script run once when new app instance is created.</div>
                  </CCardHeader>
                  <CCardBody>
                    body
                  </CCardBody>
                  <CCardFooter>
                    footer
                  </CCardFooter>
                </CCard>
                <br>
                <CCard>
                  <CCardHeader>
                    <h4 class="card-title">Start script</h4>
                    <div class="small text-body-secondary">This script run every time container starts.</div>
                  </CCardHeader>
                  <CCardBody>
                    body
                  </CCardBody>
                  <CCardFooter>
                    footer
                  </CCardFooter>
                </CCard>
                
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>



  <!-- MODALS -->
  <Modal ref="deleteModal" :title="'Remove app ' + data.name + '?'" :on_submit="deleteApp">
    This will not remove your docker image.
    <template #footer>
      <CButton color="secondary" @click="() => this.$refs.deleteModal.data.show = false">
        Storno
      </CButton>
      <CButton color="danger" type="submit">Smazat</CButton>
    </template>
  </Modal>
</template>

<script>
import { CIcon } from '@coreui/icons-vue';
import { reactive, ref } from 'vue';
import Modal from '../../components/Modal.vue';

export default {
  name: "AppEdit",
  components: {
    CIcon,
    Modal
  },
  props: {
    id: {
      type: String
    },
  },
  setup(props) {
    const isNew = !!props.id;
    console.log(isNew);

    const data = reactive(
      {
        name: "Moje pojmenovaní",
        id: "12345678",
        repository: 'biobrejn-1',
        tag: 'latest',
        image_id: '08af2227f359',
        created: '7 weeks ago',
        size: '340 MB',
      });


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
    return {
      isNew, data, deleteApp, saveChanges
    }
  },

}
</script>
