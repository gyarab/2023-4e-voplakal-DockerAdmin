<template>
  <div>
    <CRow>
      <CCol :md="12">
        <h3 id="traffic" class="card-title mb-0">Instances</h3>
        <div class="small text-body-secondary" style="margin-top: 7px;">All your <b>Docker containers</b> managed by this administration system.</div>
        <br>
        <CCard class="mb-4" v-for="app in  apps " :key="app.id">
          <CCardBody>
            <CRow>
              <CCol :sm="5">
                <h4 id="traffic" class="card-title mb-0">{{ app.name }}</h4>
                <div class="small text-body-secondary" style="margin-top: 7px;">id: {{ app.id }}</div>
              </CCol>
              <CCol :sm="7" class="d-none d-md-block">
                <router-link to="/app-edit">
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
                      <AppLi :dataRow="app.instances"></AppLi>
                    </CTableBody>
                  </CTable>

                </CCol>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter class="flex-container">
            <div class="flex-container">
              <div style="text-wrap: nowrap;">Bulk edit &nbsp;</div>
              <CFormSelect v-model="actionSelect" size="sm" class="mb-3" aria-label="Large select example">
                <option value="">Choose action</option>
                <option value="update">Change app version (update)</option>
                <option value="delete">Delete</option>
                <option value="stop">Stop</option>
              </CFormSelect>
              <CButton color="primary" size="sm" @click="editAction(actionSelect, app.instances.filter(i => i.selected))" :disabled="(actionSelect && app.instances.some(i => i.selected)) ? null : true">OK</CButton>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import AppLi from './InstanceLi.vue';
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "Instances",
  components: {
    CIcon,
    AppLi
  },
  setup() {
    //     app tag client status expiry

    const store = useStore();
    store.dispatch("getInstances")

    /**
     * 
     * @param {Array} instances 
     */
    const transformData = (instances) => {
      console.log(store.state.apps);
      const groupedArray = [];
      for (const curr of instances) {
        const appId = curr.app_id;
        let app = groupedArray.find(app => app.id === appId);
        if (!app) {
          //get info for appID
          groupedArray.push({
            id: appId,
            instances: [],
            name: store.state.apps.find(app => app.id === appId).name

            //...props of app (appID)
          })
          app = groupedArray[groupedArray.length - 1];
        }
        app.instances.push(curr);
      }

      return groupedArray;
    }

    const apps = computed(() => {
      console.log(transformData(store.state.instances));
      return transformData(store.state.instances)
    })

    const editAction = (action, selected) => {
      if (selected.length === 0) return;
      console.log(action, selected);
      switch (action) {
        case "update":

          break;
        case "delete":

          break;
        case "stop":

          break;
      }
    }

    return {
      icon, apps, actionSelect: ref(""), editAction
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