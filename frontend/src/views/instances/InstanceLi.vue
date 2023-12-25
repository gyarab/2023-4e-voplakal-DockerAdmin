<template>
    <!-- <CTableHeaderCell scope="row"><CFormCheck/></CTableHeaderCell> -->
    <CTableDataCell scope="row" active>
        <CFormCheck v-model="dataRow.selected" />
    </CTableDataCell>
    <CTableDataCell>{{ dataRow.name }}</CTableDataCell>
    <CTableDataCell>{{ dataRow.tag }}</CTableDataCell>
    <CTableDataCell>{{ dataRow.client }}</CTableDataCell>
    <CTableDataCell>{{ dataRow.status }}</CTableDataCell>
    <CTableDataCell>{{ dataRow.expiry_date }}</CTableDataCell>
    <CTableDataCell>
        <CButtonGroup role="group">
            <router-link :to="'/app-edit/' + dataRow.id">
                <CButton color="primary" variant="outline">Details</CButton>
            </router-link>
        </CButtonGroup>
        &nbsp;
        <CDropdown color="secondary">
            <CDropdownToggle component="a" color="primary">Actions</CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem @click="stop">Stop</CDropdownItem>
                <CDropdownItem @click="del">Delete</CDropdownItem>
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
                store.dispatch("instancesDelete", {
                    ids: [props.dataRow.id],
                })
            },
            stop: () => {
                store.dispatch("instancesStop", {
                    ids: [props.dataRow.id],
                })
            }
        }
    }
}
</script>
  