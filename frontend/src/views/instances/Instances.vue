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
              <CCol :sm="7" class="  d-md-block">
                <router-link :to="'/instance-create/' + app.id">
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
                      <CTableRow v-for="instance in app.instances" :key="app.id">
                        <AppLi :dataRow="instance"></AppLi>
                      </CTableRow>
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
              <CFormSelect v-if="actionSelect === 'upgrade'" v-model="actionUpgradeTag" size="sm" class="mb-3">
                <option v-for="image in app.images" :value="image.tag">{{ image.tag }}</option>
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

    /**
     * 
     * @param {Array} instances 
     */
    const transformData = (instances) => {
      const groupedArray = [];
      for (const curr of instances) {
        const appId = curr.app_id;
        let app = groupedArray.find(app => app.id === appId);
        if (!app) {
          //get info for appID
          groupedArray.push({
            id: appId,
            instances: [],
            ...store.state.apps.find(app => app.id === appId)
            //...props of app (appID)
          })
          app = groupedArray[groupedArray.length - 1];
        }
        app.instances.push(curr);
      }

      return groupedArray;
    }

    const apps = computed(() => transformData(store.state.instances))
    const actionUpgradeTag = ref("");
    const editAction = (action, selected) => {
      if (selected.length === 0) return;
      switch (action) {
        case "upgrade":
          store.dispatch("instancesUpgrade", {
            ids: selected.map(s => s.id),
            tag: actionUpgradeTag.value
          })
          break;
        case "delete":
          store.dispatch("instancesDelete", selected.map(s => s.id))
          break;
        case "stop":
          store.dispatch("instancesStop", selected.map(s => s.id))
          break;
      }
    }

    return {
      icon, apps, actionSelect: ref(""), actionUpgradeTag, editAction
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