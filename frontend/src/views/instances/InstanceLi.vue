<template>
    <!-- <CTableHeaderCell scope="row"><CFormCheck/></CTableHeaderCell> -->
    <CTableRow style="cursor: pointer;">
        <CTableDataCell scope="row" active @click="bulk">
            <CFormCheck v-model="dataRow.selected" />
        </CTableDataCell>
        <CTableDataCell @click="bulk">{{ dataRow.name }}</CTableDataCell>
        <CTableDataCell @click="bulk">{{ dataRow.image?.Tag ?? "unknown" }}</CTableDataCell>
        <CTableDataCell @click="bulk">{{ dataRow.client?.email ?? "NOT FOUND" }}</CTableDataCell>
        <CTableDataCell @click="bulk" :class="{ red: dataRow.container?.State === 'exited' }">{{ dataRow.container?.Status ?? "unknown!" }}</CTableDataCell>
        <CTableDataCell @click="bulk" :class="{ red: isExpired(dataRow.expiry_date) }">{{ dataRow.expiry_date }}</CTableDataCell>
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
<style>
.red {
    color: red !important;
}
</style>
  
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
            bulk: () => { props.dataRow.selected = !props.dataRow.selected },
            isExpired: (date) => {
                let d = new Date(date);
                return d.getTime() < new Date().getTime();
            }
        }
    }
}
</script>
  