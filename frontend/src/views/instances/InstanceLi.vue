<template>
    <!-- <CTableHeaderCell scope="row"><CFormCheck/></CTableHeaderCell> -->
    <CTableRow style="cursor: pointer;">
        <CTableDataCell scope="row" active @click="bulk">
            <CFormCheck v-model="dataRow.selected" />
        </CTableDataCell>
        <CTableDataCell @click="bulk">{{ dataRow.name }}</CTableDataCell>
        <CTableDataCell @click="bulk">{{ dataRow.image?.Tag ?? "unknown" }}</CTableDataCell>
        <CTableDataCell @click="bulk">{{ dataRow.client.email }}</CTableDataCell>
        <CTableDataCell @click="bulk">{{ dataRow.container?.Status ?? "unknown!" }}</CTableDataCell>
        <CTableDataCell @click="bulk">{{ dataRow.expiry_date }}</CTableDataCell>
        <CTableDataCell>
            <CButtonGroup role="group">
                <router-link :to="'/instance-edit/' + dataRow._id">
                    <CButton color="primary" variant="outline">Details</CButton>
                </router-link>
            </CButtonGroup>
            &nbsp;
            <CDropdown color="secondary">
                <CDropdownToggle component="a" color="primary">Actions</CDropdownToggle>
                <CDropdownMenu>
                    <CDropdownItem @click="stop" :disabled="dataRow.container?.State === 'running' ? null : true">Stop</CDropdownItem>
                    <!-- <CDropdownItem @click="del">Delete</CDropdownItem> -->
                </CDropdownMenu>
            </CDropdown>
        </CTableDataCell>
    </CTableRow>
</template>
  
<script>
import { CFormCheck } from '@coreui/vue';
import { useStore } from 'vuex';


export default {
    name: "InstanceLi",
    props: {
        dataRow: {
            type: Object,
            required: true
        },
    },
    components: {
        CFormCheck
    },
    setup(props, context) {
        const store = useStore()
        return {
            del: () => {
                store.dispatch("instancesDelete", [props.dataRow.id])
            },
            stop: () => {
                store.dispatch("instancesStop", [props.dataRow.container_id])
            },
            bulk: () => { props.dataRow.selected = !props.dataRow.selected }
        }
    }
}
</script>
  