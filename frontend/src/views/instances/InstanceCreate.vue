<template>
    <CContainer>
        <CRow class="justify-content-center">
            <CCol :lg="7">
                <CCard>
                    <div v-if="status === 'in progress'">working...</div>
                    <CCardBody v-else-if="status === 'done'">
                        <CRow class="justify-content-center">
                            <h3 v-html="message"></h3>
                        </CRow>
                    </CCardBody>
                    <CCardBody v-else>
                        <CRow class="justify-content-center" v-if="app">
                            <h3>Create your own instance of {{ app.name }}</h3><br>
                            <p class="small text-body-secondary"> Fill in the form below and get info to your email</p>
                            <CCol :sm="12" class="align-self-center">
                                <InitForm :data="app" inUse @create-instance="(formData) => createInstance(formData)"> </InitForm>
                            </CCol>
                        </CRow>
                        <CRow class="justify-content-center" v-else>
                            <h3>Can not find App with ID: {{ appId }}</h3><br>
                        </CRow>
                    </CCardBody>

                </CCard>
            </CCol>
        </CRow>
    </CContainer>
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import InitForm from '../apps/forms/InitForm.vue';


export default {
    components: {
        InitForm,
    },
    props: {
        appId: {
            type: String,
            requied: true
        },
    },
    setup(props) {
        console.log(props.appId);
        const store = useStore()
        store.dispatch("getPublicApps");
        const app = computed(() => store.state.apps?.find(app => app.id === props.appId));
        const status = ref(false)
        const message = ref("")

        const createInstance = async (formData) => {
            if (!props.appId || !formData.inputEmail || !formData.instanceName) return window.apiErrors.value.push(new Error("in the form you are missing: email or instanceName"));


            status.value = "in progress";
            let res = await store.dispatch("instanceCreate", {
                app_id: props.appId,
                client_email: formData.inputEmail,
                instance_name: formData.instanceName,
                form_data: formData
            },)
            status.value = "done";
            console.log(res);
            message.value = res.message;
        }

        return { app, createInstance, status, message }
    },
}
</script>