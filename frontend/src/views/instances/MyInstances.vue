<template>
  <div>
    <CRow>
      <CCol :md="12">
        <h3 id="traffic" class="card-title mb-0">My Instances</h3>
        <div class="small text-body-secondary" style="margin-top: 7px;">All your <b>Applications</b> managed by this administration system.</div>
        <br>
        <CSpinner v-if="!instances" />
        <h4 v-else v-if="!instances[0]">You have no instance.</h4>
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
                        <CTableDataCell :class="{ red: isExpired(instance.expiry_date) }">{{ instance.expiry_date ?? "never" }}</CTableDataCell>

                        <CTableDataCell>
                          <CButton color="primary" @click="() => longerInstance(instance._id)">Longer subscription</CButton>
                          &nbsp;
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
  <MyModal :data="deleteModal" :title="'Delete instance?'">
    All data belonging to this instance will be deleted. Are you sure you want to delete it? It is not reversible.
    <template #footer>
      <CButton color="secondary" @click="() => deleteModal.show = false">
        Storno
      </CButton>
      <CButton color="danger" type="submit">Delete</CButton>
    </template>
  </MyModal>
  <MyModal :data="longerInstanceModal" :title="'For how long?'">
    Select for how long do you want to pay:
    <CFormInput type="number" placeholder="6" text="months. (one month is considered as 30 days)" min="1" required v-model="months" />
    <template #footer>
      <CButton color="secondary" @click="() => longerInstanceModal.show = false">
        Storno
      </CButton>
      <CButton color="success" type="submit">Pay</CButton>
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

    const longerInstanceModal = reactive({
      show: false,
      data: {},
    });

    const months = ref(6);
    const longerInstance = (instId) => {
      longerInstanceModal.show = true;
      longerInstanceModal.onSubmit = () => {
        store.dispatch("createCheckoutSession", { instance_id: instId, months: months.value })
      }
    }

    return {
      icon, instances, deleteModal, deleteInstnace, longerInstance, months, longerInstanceModal, isExpired: (date) => {
        let d = new Date(date);
        return d.getTime() < new Date().getTime();
      }
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
.red {
    color: red !important;
}
</style>