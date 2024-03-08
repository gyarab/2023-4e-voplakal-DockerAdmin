<template>
  <div v-if="!data">
    <CSpinner />
    <div>We cannot find it...</div>
  </div>
  <div v-else>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="9">
                <h4 class="card-title mb-0"> {{ data.name }}</h4>
                <div class="small text-body-secondary" style="margin-top: 7px;">Editing app belonging to a docker image.</div>
                <div class="small text-body-secondary">id: {{ data._id }}</div>
              </CCol>
              <CCol :sm="3" class="d-md-block">
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton class="float-end" color="danger" variant="ghost" @click="() => this.$refs.deleteModal.data.show = true">Delete</CButton>
                  <CButton class="float-end" color="success" size="lg" @click="saveChanges">Save</CButton>
                </div>
              </CCol>

            </CRow>
            <br>
            <CRow>
              <CCol :sm="12" :lg="5" :xl="4" :xxl="4">
                <CCard v-for="(image, index) in  data.images " :key="image.image_id" style="margin-bottom: 25px;">
                  <CCardBody>

                    <CTable>
                      <CTableBody>
                        <CTableRow v-for="( prop, key ) in  image " :key="prop.ID">
                          <CTableHeaderCell scope="row">{{ key }}</CTableHeaderCell>
                          <CTableDataCell style="word-break: break-word">{{ prop }}</CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                  <CCardFooter>
                    <CRow>
                      <CCol>
                        <CTooltip content="Set this image as default for new instances" placement="right">
                          <template #toggler="{ on }">
                            <span v-on="on">
                              <div @click="() => data.selected_image_id = image.ID">
                                <CFormCheck :button="{ color: 'primary', variant: 'outline' }" type="radio" name="btnradio" :id="image.image_id" autocomplete="off" label="Set default" :checked="data.selected_image_id === image.ID ? '' : null" />
                              </div>
                            </span>
                          </template>
                        </CTooltip>
                      </CCol>
                    </CRow>
                  </CCardFooter>
                </CCard>
              </CCol>

              <CCol>
                <CNav variant="tabs" style="cursor: pointer;">
                  <CNavItem>
                    <CNavLink :active="nav === 'init' ? '' : null" @click="nav = 'init'">
                      Init script
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink :active="nav === 'run' ? '' : null" @click="nav = 'run'">
                      Run script
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink :active="nav === 'del' ? '' : null" @click="nav = 'del'">
                      Delete script
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink :active="nav === 'form' ? '' : null" @click="nav = 'form'">
                      User init form
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <div v-show="nav === 'init'">
                  <CCard> <!--Init script-->
                    <CCardHeader>
                      <h4 class="card-title">Init script</h4>
                      <div class="small text-body-secondary">This script run once when new app instance is created. In $variables you get all props from init form.</div>
                    </CCardHeader>
                    <CCardBody>
                      <v-ace-editor v-model:value="data.init_code" lang="sh" theme="chrome" style="height: 600px; resize: vertical; font-size: medium;" />
                      <!-- prop: wrap -->
                    </CCardBody>
                    <CCardFooter>
                      <!-- script is located in ./Apps/{{ data.folder }}/init.sh -->
                    </CCardFooter>
                  </CCard>
                </div>

                <div v-show="nav === 'run'">
                  <CCard><!-- Run script -->
                    <CCardHeader>
                      <h4 class="card-title">Run script</h4>
                      <div class="small text-body-secondary">This script run every time container runs. In $variables you get all props from init form. Script usually includes <code>docker run</code> command and must return container id as a second stdout line.</div>
                    </CCardHeader>
                    <CCardBody>
                      <v-ace-editor v-model:value="data.run_code" lang="sh" theme="chrome" style="height: 600px; resize: vertical; font-size: medium;" />
                    </CCardBody>
                    <CCardFooter>
                      last command have to be docker run<br>example: <code>docker run -dp $PORT:80 docker/getting-started</code>
                    </CCardFooter>
                  </CCard>
                </div>
                <div v-show="nav === 'del'">
                  <CCard><!-- Run script -->
                    <CCardHeader>
                      <h4 class="card-title">Delete script</h4>
                      <div class="small text-body-secondary">This script run when the containeris about to remove. In $variables you get all props from init form. Script usually includes commands to remove remote database. There is no need to delete its mount folder which is removed automaticaly.</div>
                    </CCardHeader>
                    <CCardBody>
                      <v-ace-editor v-model:value="data.remove_code" lang="sh" theme="chrome" style="height: 600px; resize: vertical; font-size: medium;" />
                    </CCardBody>
                    <CCardFooter>
                    </CCardFooter>
                  </CCard>
                </div>

                <div v-show="nav === 'form'">
                  <CCard><!-- Init form -->
                    <CCardHeader>
                      <CRow>
                        <CCol :sm="8">
                          <h4 class="card-title">User init form</h4>
                          <div class="small text-body-secondary">This form is to be filled by user when inicializing this App.</div>
                        </CCol>
                        <CCol :sm="4" class="d-md-block">
                          <CButton color="primary" class="float-end" @click="() => editFormModal.show = true">
                            <!-- @click="() => this.$refs.deleteModal.data.show = true" -->
                            <CIcon icon="cil-pencil" />
                            Edit
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardHeader>
                    <CCardBody>
                      <InitForm :data="data" dataPreview></InitForm>
                    </CCardBody>
                    <CCardFooter>
                      Filled values from the form will be passed to Init script.
                    </CCardFooter>
                  </CCard>
                </div>
                <br>


                <CCard><!-- PRICE -->
                  <CCardHeader>
                    <h4 class="card-title">Price</h4>
                  </CCardHeader>
                  <CCardBody>
                    <CFormInput type="number" min="0" v-model="data.price" label="Price per month" text="set 0 to make it free to use" required />
                    <div style="margin-top: 15px;"></div>
                    <CFormInput type="number" label="Number of try for free days" text="This is expiry period." v-model="data.free_days" min="0" required />
                  </CCardBody>
                  <!-- <CCardFooter>
                    </CCardFooter> -->
                </CCard>
                <br>
                <CCard><!-- Routes -->
                  <CCardHeader>
                    <h4 class="card-title">Domain</h4>
                    <div class="small text-body-secondary">Every instance will be given a domain instance-name.your-domain.com</div>

                  </CCardHeader>
                  <CCardBody>
                    <CFormInput type="text" label="" text="Leave empty to disable public acess on subdomain on https." v-model="data.domain" placeholder="example.com" />
                  </CCardBody>
                  <!-- <CCardFooter>
                    </CCardFooter> -->
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

    </CRow>

    <!-- MODALS -->
    <MyModal ref="deleteModal" :title="'Remove app ' + data.name + '?'" :on_submit="deleteApp">
      This will not remove your docker image.
      <template #footer>
        <CButton color="secondary" @click="() => this.$refs.deleteModal.data.show = false">
          Storno
        </CButton>
        <CButton color="danger" type="submit">Delete</CButton>
      </template>
    </MyModal>
    <CModal fluid fullscreen size="xl" :visible="editFormModal.show" @close="() => { editFormModal.show = false }">
      <CModalHeader>
        <CModalTitle>User init form Customization</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <InitForm :data="data" edit editFull dataPreview></InitForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" type="submit" @click="() => { editFormModal.show = false }">Close & continue</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>


<script>
import { CIcon } from '@coreui/icons-vue';
import { reactive, ref, computed, watch, onUnmounted } from 'vue';
import MyModal from '../../components/MyModal.vue';
import { VAceEditor } from "vue3-ace-editor";
// import 'ace-builds/src-noconflict/mode-sh';
// import 'ace-builds/src-noconflict/theme-chrome';

import ace from 'ace-builds';
import modeJsonUrl from 'ace-builds/src-noconflict/mode-sh?url';
ace.config.setModuleUrl('ace/mode/sh', modeJsonUrl);

import themeChromeUrl from 'ace-builds/src-noconflict/theme-chrome?url';
ace.config.setModuleUrl('ace/theme/chrome', themeChromeUrl);

import InitForm from './forms/InitForm.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';



export default {
  name: "AppEdit",
  components: {
    CIcon,
    MyModal,
    VAceEditor,
    InitForm,
  },
  props: {
    id: {
      type: String
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter()

    //todo load item data app_id: props.id
    const data = computed(() => store.state.apps?.find(a => a._id === props.id));

    if (!store.state.apps) store.dispatch("getApps");

    const deleteApp = () => {
      store.dispatch("deleteApp", data.value._id)
      router.push("/apps")
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

    const saveChanges = () => {
      store.dispatch("saveApp", data.value)
    }

    const nav = ref('init');
    const editFormModal = reactive({
      show: false
    })
    return {
      data, deleteApp, saveChanges, nav, editFormModal
    }
  },

}

</script>
