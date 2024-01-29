<template>
  <div>
    <CRow>
      <CCol :md="12">
        <h3 id="traffic" class="card-title mb-0">My Instances</h3>
        <div class="small text-body-secondary" style="margin-top: 7px;">All your <b>Applications</b> managed by this administration system.</div>
        <br>
        <CSpinner v-if="!instances" />
        <h4 v-else v-if="!instances[0]">You have no instance. Create one.</h4>
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol>
                <CCol :md="12">
                  <CTable striped hover>
                    <CTableHead>
                      <CTableRow color="dark">
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Created on</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Expiry date</CTableHeaderCell>
                        <CTableHeaderCell scope="col"></CTableHeaderCell> <!--action buttons-->
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow v-for="instance in instances" :key="instance.id">
                        <CTableDataCell>{{ instance.name }}</CTableDataCell>
                        <CTableDataCell>{{ instance.created_on }}</CTableDataCell>
                        <CTableDataCell>{{ instance.expiry_date ?? "never" }}</CTableDataCell>

                        <CTableDataCell>
                          <router-link :to="'/longer-subscription/' + instance._id">
                            <CButton color="primary">Longer subscription</CButton>
                          </router-link>&nbsp;
                          <CButton color="primary" variant="outline" @click="() => deleteInstnace(instance._id)">Delete</CButton>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter class="flex-container">

          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
  <!-- MODALS -->
  <MyModal :data="deleteModal" :title="'Delete instance(s)?'">
    All data belonging to this instance(s) will be deleted. Are you sure you want to delete it? It is not reversible.
    <template #footer>
      <CButton color="secondary" @click="() => deleteModal.show = false">
        Storno
      </CButton>
      <CButton color="danger" type="submit">Delete</CButton>
    </template>
  </MyModal>
</template>

<script>
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import InstanceLi from './InstanceLi.vue';
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { CSpinner } from '@coreui/vue';
import MyModal from '../../components/MyModal.vue';

export default {
  name: "MyInstances",
  components: {
    CIcon,
    InstanceLi,
    CSpinner,
    MyModal
  },
  setup() {
    const store = useStore();
    store.dispatch("getInstances");

    const deleteModal = reactive({
      show: false,
      data: {},
    });

    const deleteInstnace = (instId) => {
      deleteModal.show = true;
      deleteModal.onSubmit = () => {
        store.dispatch("instancesDelete", instId)
      }
    }
    const instances = computed(() => store.state.instances)

    return {
      icon, instances, deleteModal, deleteInstnace
    }
  }
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