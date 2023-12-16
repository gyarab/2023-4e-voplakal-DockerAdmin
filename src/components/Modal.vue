<template>
    <CModal :visible="data.show" @close="() => { data.show = false }">
        <CModalHeader>
            <CModalTitle>
                {{ title }}
            </CModalTitle>
        </CModalHeader>
        <CForm :onsubmit="(e) => { e.preventDefault(); on_submit(); data?.onSubmit(); data.show = false }">
            <CModalBody>
                <slot></slot>
            </CModalBody>
            <CModalFooter v-if="!this.$slots.footer">
                <CButton color="secondary" @click="() => { data.show = false }">
                    Storno
                </CButton>
                <CButton color="primary" type="submit">Uložit</CButton>

            </CModalFooter>
            <CModalFooter v-else>
                <slot name="footer"></slot>
            </CModalFooter>
        </CForm>
    </CModal>
</template>
  
<script>
import { CIcon } from '@coreui/icons-vue';
import * as icon from '@coreui/icons';
import { reactive } from 'vue';

export default {
    name: "Modal",
    components: {
    },
    props: {
        data: {
            type: Object,
            default: reactive({
                show: false,
                onSubmit: () => { }
            })
        },
        title: {
            type: String
        },
        on_submit: {
            type: Function,
            default: () => { }
        }
    },
    setup(props, { slots }) {
        return {
            icon, data: props.data
        }
    }
}
</script>
  

<!-- USAGE
  <Modal :data="addAppModal" title="ahoj">
    ahhoj
    <template #footer> butons</template>
  </Modal>


const addAppModal = reactive({
      show: false,
      data: {},
      submit: () => {
        console.log("ok");
      }
    });




 -->