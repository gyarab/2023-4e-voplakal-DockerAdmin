<template>
  <div>
    <CRow>
      <CCol :md="12">
        <h3 id="traffic" class="card-title mb-0">Instances</h3>
        <div class="small text-body-secondary" style="margin-top: 7px;">All your <b>Docker containers</b> managed by this administration system.</div>
        <br>
        <CSpinner v-if="!apps" />
        <h4 v-else v-if="!apps[0]">You have to <router-link to="/apps"> create an App</router-link> at first</h4>
        <CCard class="mb-4" v-for="app in apps " :key="app._id">
          <CCardBody>
            <CRow>
              <CCol :sm="5">
                <h4 id="traffic" class="card-title mb-0">{{ app.name }}</h4>
                <div class="small text-body-secondary" style="margin-top: 7px;">id: {{ app._id }}</div>
              </CCol>
              <CCol :sm="7" class="  d-md-block">
                <router-link :to="'/instance-create/' + app._id">
                  <CButton size="lg" color="primary" class="float-end">
                    <CIcon size="xl" :icon="icon.cilPlus" />
                    Add
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
                        <CTableHeaderCell scope="col"></CTableHeaderCell> <!--checkbox-->
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">tag (version)</CTableHeaderCell>
                        <CTableHeaderCell scope="col">client</CTableHeaderCell>
                        <CTableHeaderCell scope="col">status</CTableHeaderCell>
                        <CTableHeaderCell scope="col">expiry date</CTableHeaderCell>
                        <CTableHeaderCell scope="col"></CTableHeaderCell> <!--action buttons-->
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <InstanceLi v-for="instance in app.instances" :key="app._id" :dataRow="instance">
                      </InstanceLi>
                    </CTableBody>
                  </CTable>

                </CCol>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter class="flex-container">
            <div class="flex-container">
              <div style="text-wrap: nowrap;">Bulk edit &nbsp;</div>
              <CFormSelect v-model="actionSelect" size="sm" class="mb-3">
                <option value="">Choose action</option>
                <option value="upgrade">Change app version (upgrade)</option>
                <option value="delete">Delete</option>
                <option value="stop">Stop</option>
              </CFormSelect>
              <CFormSelect v-if="actionSelect === 'upgrade'" v-model="actionUpgradeImage" size="sm" class="mb-3">
                <option :value="null">select version (image tag)</option>
                <option v-for="image in app.images" :value="image.ID">{{ image.Tag }}</option>
              </CFormSelect>
              <CButton color="primary" size="sm" @click="editAction(actionSelect, app.instances.filter(i => i.selected))" :disabled="((actionSelect && app.instances?.some(i => i.selected)) ? null : true) || actionUpgradeImage === null">OK</CButton>
            </div>
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
  name: "Instances",
  components: {
    CIcon,
    InstanceLi,
    CSpinner,
    MyModal
  },
  setup() {
    //     app tag client status expiry

    const store = useStore();
    store.dispatch("getApps");
    store.dispatch("getInstances");
    /**
     * 
     * @param {Array} instances 
     */
    const transformData = (instances, storeApps) => {
      if (!instances || !storeApps) return null;
      const groupedArray = [];
      for (const curr of instances) {
        const appId = curr.app_id;
        let app = groupedArray.find(app => app.id === appId);
        if (!app) {
          //get info for appID
          groupedArray.push({
            id: appId,
            instances: [],
            ...storeApps.find(app => app.id === appId)
            //...props of app (appID)
          })
          app = groupedArray[groupedArray.length - 1];
        }
        app.instances.push(curr);
      }
      for (const a of storeApps) {
        if (!groupedArray.some(ga => ga.name === a.name))
          groupedArray.push(a);
      }
      console.log(groupedArray);
      return groupedArray;
    }

    const deleteModal = reactive({
      show: false,
      data: {},
    });

    const apps = computed(() => transformData(store.state.instances, store.state.apps))
    const actionUpgradeImage = ref("");
    const editAction = (action, selected) => {
      if (selected.length === 0) return;
      switch (action) {
        case "upgrade":
          store.dispatch("instancesUpgrade", {
            ids: selected.map(s => s.id),
            imageId: actionUpgradeImage.value
          })
          break;
        case "delete":
          deleteModal.show = true;
          deleteModal.onSubmit = () => {
            store.dispatch("instancesDelete", selected.map(s => s.id))
          }
          break;
        case "stop":
          store.dispatch("instancesStop", selected.map(s => s.container_id))
          break;
      }
    }

    return {
      icon, apps, actionSelect: ref(""), actionUpgradeImage, editAction, deleteModal
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