<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="12">
              instance editor
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>


<script>
import { reactive, ref, computed } from 'vue';

import { useStore } from 'vuex';



export default {
  name: "AppEdit",
  components: {
 
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
    console.log(props.id);
    const data = computed(() => store.state.apps[0]);


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

    const editFormModal = reactive({
      show: false
    })


    return {
      isNew, data, deleteApp, saveChanges, nav, editFormModal,
    }
  },

}

</script>
