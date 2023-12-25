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
                  <CButton class="float-end" color="danger" variant="ghost" @click="() => this.$refs.deleteModal.data.show = true">Delete</CButton>
                  <CButton class="float-end" color="success" size="lg" @click="saveChanges">Save</CButton>
                </div>
              </CCol>

            </CRow>
            <br>
            <CRow>
              <CCol :sm="12" :lg="5" :xl="4" :xxl="3">
                <CCard v-for="(image, index) in data.images" :key="image.image_id" style="margin-bottom: 25px;">
                  <CCardBody>
                    <CTable>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Repository</CTableHeaderCell>
                          <CTableDataCell>{{ data.repository }}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell scope="row">Tag</CTableHeaderCell>
                          <CTableDataCell><b>{{ image.tag }}</b></CTableDataCell>
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
                          <CTableDataCell>{{ image.image_id }}</CTableDataCell>
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
                              <CFormCheck type="radio" :button="{ color: 'primary', variant: 'outline' }" name="btnradio" :id="image.image_id" autocomplete="off" label="Set default" :checked="data.selected_image === index ? '' : null" @click="data.selected_image = index" />
                            </span>
                          </template>
                        </CTooltip>
                      </CCol>
                    </CRow>
                  </CCardFooter>
                </CCard>
              </CCol>

              <CCol>
                <CNav variant="tabs">
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
                    <CNavLink :active="nav === 'form' ? '' : null" @click="nav = 'form'">
                      User init form
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <div v-show="nav === 'init'">
                  <CCard> <!--Init script-->
                    <CCardHeader>
                      <h4 class="card-title">Init script</h4>
                      <div class="small text-body-secondary">This script run once when new app instance is created.</div>
                    </CCardHeader>
                    <CCardBody>
                      <v-ace-editor v-model:value="data.init_code" lang="sh" theme="chrome" style="height: 600px; resize: vertical; font-size: medium;" />
                      <!-- prop: wrap -->
                    </CCardBody>
                    <CCardFooter>
                      script is located in ./Apps/{{ data.folder }}/init.sh
                    </CCardFooter>
                  </CCard>
                </div>

                <div v-show="nav === 'run'">
                  <CCard><!-- Run script -->
                    <CCardHeader>
                      <h4 class="card-title">Run script</h4>
                      <div class="small text-body-secondary">This script run every time container runs.</div>
                    </CCardHeader>
                    <CCardBody>
                      <v-ace-editor v-model:value="data.run_code" lang="sh" theme="chrome" style="height: 600px; resize: vertical; font-size: medium;" />
                    </CCardBody>
                    <CCardFooter>
                      script is located in ./Apps/{{ data.folder }}/run.sh
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
                      <InitForm :htmlForm="htmlForm" dataPreview></InitForm>
                    </CCardBody>
                    <CCardFooter>
                      Filled values from the form will be passed to Init script.
                    </CCardFooter>
                  </CCard>
                </div>
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
  <CModal fluid fullscreen size="xl" :visible="editFormModal.show" @close="() => { editFormModal.show = false }">
    <CModalHeader>
      <CModalTitle>User init form Customization</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <InitForm :htmlForm="htmlForm" edit editFull dataPreview></InitForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="primary" type="submit" @click="() => { editFormModal.show = false }">Close & continue</CButton>
    </CModalFooter>
  </CModal>
</template>


<script>
import { CIcon } from '@coreui/icons-vue';
import { reactive, ref, computed } from 'vue';
import Modal from '../../components/Modal.vue';
import { VAceEditor } from "vue3-ace-editor";
// import 'ace-builds/src-noconflict/mode-sh';
// import 'ace-builds/src-noconflict/theme-chrome';

import ace from 'ace-builds';
import modeJsonUrl from 'ace-builds/src-noconflict/mode-sh?url';
ace.config.setModuleUrl('ace/mode/sh', modeJsonUrl);

import themeChromeUrl from 'ace-builds/src-noconflict/theme-chrome?url';
ace.config.setModuleUrl('ace/theme/chrome', themeChromeUrl);

import InitForm from './forms/InitForm.vue';



export default {
  name: "AppEdit",
  components: {
    CIcon,
    Modal,
    VAceEditor,
    InitForm
  },
  props: {
    id: {
      type: String
    },
  },
  setup(props) {
    const isNew = !!props.id;

    //todo load item data app_id: props.id
    console.log(props.id);
    const data = reactive(
      {
        name: "Moje pojmenovaní",
        id: "12345678",
        repository: 'biobrejn-1',
        folder: 'moje-pojmenovani',
        images: [{
          tag: 'latest',
          image_id: '08af2227f359',
          created: '7 weeks ago',
          size: '340 MB',
        }, {
          tag: 'recent',
          image_id: '18af2227f359',
          created: '8 weeks ago',
          size: '540 MB',
        },
        {
          tag: 'recent',
          image_id: '88af2227f359',
          created: '8 weeks ago',
          size: '540 MB',
        }
        ],
        selected_image: 0,
        // //computed on mongo
        // image_selected: {
        //   tag: 'latest',
        //   image_id: '08af2227f359',
        //   created: '7 weeks ago',
        //   size: '340 MB',
        // },
        init_code: codeExample,
        run_code: codeExample,
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
    const nav = ref('init');
    const htmlForm = reactive({ value: formHtmlPlaceholderData })

    const editFormModal = reactive({
      show: false
    })


    return {
      isNew, data, deleteApp, saveChanges, nav, htmlForm, editFormModal,
    }
  },

}



let formHtmlPlaceholderData = `<div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="enputEmail">
                            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" name="pass">
                        </div>
                        <div class="mb-3 form-check">
                            <input class="form-check-input" type='hidden' id="exampleCheck1" value='0' name='checkbs'> <!--set unchecked value-->
                            <input type="checkbox" class="form-check-input" id="exampleCheck1" name="checkbs" value="1" checked>
                            <label class="form-check-label" for="exampleCheck1">Check me out</label>
                        </div>

                        <label for="pet-select">Choose a pet:</label>
                        <select class="form-select" name="pet" id="pet-select" aria-label="asdfasdf">
                            <option value="">--Please choose an option--</option>
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="hamster">Hamster</option>
                            <option value="parrot">Parrot</option>
                            <option value="spider">Spider</option>
                            <option value="goldfish">Goldfish</option>
                        </select>
                        <div>

                            <label for="exampleColorInput" class="form-label">Color picker</label>
                            <input type="color" class="form-control form-control-color" id="exampleColorInput" value="#563d7c" title="Choose your color" name="color">
                        </div>

                        <div class="form-check">
                            <!--set unchecked value-->
                            <input class="form-check-input" type='hidden' value='0' name='checkbox1'>
                            <input class="form-check-input" type='checkbox' value='1' name='checkbox1' id="selfdestruct">
                            <label class="form-check-label" for="selfdestruct">
                                Default ujncehcked checkbox
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type='hidden' value='0' name='checkbox2'> <!--set unchecked value-->
                            <input class="form-check-input" type='checkbox' value='1' name='checkbox2' id="selfdestruct1" checked>
                            <label class="form-check-label" for="selfdestruct1">
                                Default checked checkbox
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="jedna">
                            <label class="form-check-label" for="flexRadioDefault1">
                                Default radio
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked value="dva">
                            <label class="form-check-label" for="flexRadioDefault2">
                                Default checked radio
                            </label>
                        </div>

                        <div class="form-check form-switch">

                            <input class="form-check-input" type='hidden' value='off' name='flexSwitchCheckDefault'> <!--set unchecked value-->
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" name="flexSwitchCheckDefault">
                            <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
                        </div>

                        <label for="customRange1" class="form-label">Example range</label>
                        <input type="range" class="form-range" id="customRange1" name="formRange">

                        <div class="form-floating">
                            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px" name="text"></textarea>
                            <label for="floatingTextarea2">Comments</label>
                        </div>
                        <button type="submit" id="submiter" class="btn btn-primary">Submit</button>`;

                        let codeExample = `#!/bin/bash

set -e


# example usage:
example="./restDock containerName port_to_expose"
#	./restDock hrozinka-main 8083

if [[ -z $1 ]] ; then
    echo 'missing argument. You have to specify image name or type help for getting example.'
    exit 1
fi
if [[ $1 == help ]]; then 
	echo $example
fi
if [[ -z $2 ]] ; then
    echo 'missing argument. You have to specify volume dir name! Also used for container name.'
    exit 1
fi
if [[ -z $3 ]] ; then
    echo 'missing argument. You have to specify port to expose!'
    exit 1
fi

mount_dir=$(pwd)/mounts/$2

# check if backend .env.local file exist
if [ -f "$mount_dir/.env.local" ]; then
        echo "config file successfully found"
else
    echo "file $mount_dir/.env.local does not exist"
    exit 1
fi

sudo docker rm -f $2
sudo docker run -dp $3:3000 --name $2 -v "$mount_dir:/app/data" --restart always --network mongo-network $1
`

</script>
