<template>
    <CTableRow v-for="item in dataRow" :key="item.id">
        <!-- <CTableHeaderCell scope="row"><CFormCheck/></CTableHeaderCell> -->
        <CTableDataCell scope="row" active>
            <CFormCheck v-model="item.selected" />
        </CTableDataCell>
        <CTableDataCell>{{ item.name }}</CTableDataCell>
        <CTableDataCell>{{ item.tag }}</CTableDataCell>
        <CTableDataCell>{{ item.client }}</CTableDataCell>
        <CTableDataCell>{{ item.status }}</CTableDataCell>
        <CTableDataCell>{{ item.expiry_date }}</CTableDataCell>
        <CTableDataCell>
            <CButtonGroup role="group">
                <router-link :to="'/app-edit/' + item.id">
                    <CButton color="primary" variant="outline">Details</CButton>
                </router-link>
            </CButtonGroup>

        </CTableDataCell>

    </CTableRow>
</template>
  
<script>
import { CFormCheck } from '@coreui/vue';


export default {
    name: "AppLi",
    props: {
        dataRow: {
            type: Array,
            default: []
        },
    },
    components: {
        CFormCheck
    },
    setup(props, context) {
        return {

        }
    }
}
</script>
  