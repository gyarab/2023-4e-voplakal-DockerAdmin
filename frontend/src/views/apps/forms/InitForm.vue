<template>
    <div>
        <CContainer v-if="!inUse">
            <CRow class="align-items-start" style="height: 100%;">
                <CCol v-if="edit" :xs="8">
                    <CCard class="mb-4">
                        <CCardHeader>
                            <h4>Html form content</h4>Between {{ '<form></form>' }} tags<br><br>
                            <b>you have to include:<br> <code>{{ '<input name="inputEmail" required>' }}</code></b>
                        </CCardHeader>
                        <CCardBody>
                            <v-ace-editor wrap v-model:value="data.htmlForm" lang="sh" theme="chrome" style="height: 700px; resize: vertical; font-size: medium;" @input="loadData" />
                            <div v-if="!htmlFormValid" style="font-size: larger; background-color: red;">You are missing input with <b>name="inputEmail"</b> or <b>name="instanceName"</b> in the form!</div>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CRow>
                        <CCol :xs="editFull ? 12 : 8">
                            <CCard>
                                <CCardHeader>Preview</CCardHeader>
                                <CCardBody>
                                    <form :onsubmit="() => false" ref="form" @change="loadData" v-html="data.htmlForm"> </form>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol :xs="editFull ? 12 : 4">
                            <CCard>
                                <CCardHeader>Data object</CCardHeader>
                                <CCardBody>
                                    <div v-if="dataPreview" :xs="2" style="white-space: pre; font-size: small;" v-html="formFilledValuesString"> </div>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
        </CContainer>
        <CContainer v-if="inUse">
            <form :onsubmit="(e) => { e.preventDefault(); formSubmit() }" ref="form" @change="loadData" v-html="data.htmlForm"> </form>
        </CContainer>
    </div>
</template>

<script>
import { ref, onUpdated, onMounted, reactive, computed, watch } from 'vue'
import { VAceEditor } from "vue3-ace-editor";
// import 'ace-builds/src-noconflict/mode-sh';
// import 'ace-builds/src-noconflict/theme-chrome';
import ace from 'ace-builds';
import modeJsonUrl from 'ace-builds/src-noconflict/mode-sh?url';
ace.config.setModuleUrl('ace/mode/sh', modeJsonUrl);

import themeChromeUrl from 'ace-builds/src-noconflict/theme-chrome?url';
ace.config.setModuleUrl('ace/theme/chrome', themeChromeUrl);

export default {
    name: "InitForm",
    components: {
        VAceEditor,
    },
    emits: ['createInstance'],
    props: {
        data: {
            type: Object, //reactive
            // default: 'nene'
        },
        edit: {
            type: Boolean,
            default: false
        },
        inUse: {
            type: Boolean,
            default: false
        },
        editFull: {
            type: Boolean,
            default: false
        },
        dataPreview: {
            type: Boolean,
            default: false
        },
    },
    setup(props, { emit }) {
        const data = props.data;
        const form = ref();

        const formFilledValues = ref({});
        let loadData = () => {
            // const submitter = document.getElementById("submiter")
            // console.log(submitter);
            const formData = new FormData(form.value)//, submitter);

            let out = {};
            for (const [key, value] of formData) {
                out[key] = value;
            }
            formFilledValues.value = out;
        }

        const formFilledValuesString = computed(() => {
            return syntaxHighlight(JSON.stringify(formFilledValues.value, null, 2))
        });
        // onUpdated(() => loadData())
        onMounted(() => loadData())

        const formSubmit = () => {
            emit('createInstance', formFilledValues.value)
        }
        const htmlFormValid = computed(() =>
            (data.htmlForm?.includes('name="inputEmail"') || data.htmlForm?.includes("name='inputEmail'"))
            &&
            (data.htmlForm?.includes('name="instanceName"') || data.htmlForm?.includes("name='instanceName'")))
        return {
            form, loadData, formFilledValuesString, data, formSubmit, htmlFormValid
        }
    }
}


function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

</script>


<style>
pre {
    outline: 1px solid #ccc;
    padding: 5px;
    margin: 5px;
}

.string {
    color: green;
}

.number {
    color: darkorange;
}

.boolean {
    color: blue;
}

.null {
    color: magenta;
}
</style>