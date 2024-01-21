<template>
    <!-- <CTableHeaderCell scope="row"><CFormCheck/></CTableHeaderCell> -->
    <CTableDataCell scope="row" active @click="() => { dataRow.selected = !dataRow.selected }">
        <CFormCheck v-model="dataRow.selected" />
    </CTableDataCell>
    <CTableDataCell>{{ dataRow.name }}</CTableDataCell>
    <CTableDataCell>{{ dataRow.image?.Tag ?? "unknown" }}</CTableDataCell>
    <CTableDataCell>{{ dataRow.client.email }}</CTableDataCell>
    <CTableDataCell>{{ dataRow.container?.Status ?? "unknown!" }}</CTableDataCell>
    <CTableDataCell>{{ dataRow.expiry_date }}</CTableDataCell>
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
                <CDropdownItem @click="stop" :disabled="dataRow.container.State === 'running' ? null : true">Stop</CDropdownItem>
                <!-- <CDropdownItem @click="del">Delete</CDropdownItem> -->
            </CDropdownMenu>
        </CDropdown>

    </CTableDataCell>
</template>
  
<script>
import { CFormCheck } from '@coreui/vue';
import { useStore } from 'vuex';


export default {
    name: "AppLi",
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
            }
        }
    }
}
</script>
  