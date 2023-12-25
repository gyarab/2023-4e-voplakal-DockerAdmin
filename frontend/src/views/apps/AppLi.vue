<template>
    <CTableHeaderCell scope="row">{{ rowData.repository }}</CTableHeaderCell>
    <CTableDataCell>{{ rowData.tag }}</CTableDataCell>
    <CTableDataCell>{{ rowData.created }}</CTableDataCell>
    <CTableDataCell>{{ rowData.size }}</CTableDataCell>
    <CTableDataCell>{{ rowData.image_id }}</CTableDataCell>
    <CTableDataCell>
        <CButtonGroup role="group">
            <router-link :to="'/app-edit/' + rowData.id">
                <CButton color="primary" variant="outline">Details</CButton>
            </router-link>
        </CButtonGroup>

    </CTableDataCell>
</template>
  
<script>

export default {
    name: "AppLi",
    props: {
        rowData: {
            type: Object,
            required: true
        },
    },
    components: {
    },
    setup(context) {
        return {

        }
    }
}
</script>
  