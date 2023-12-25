<template>
    <CTableHeaderCell scope="row">{{ rowData.name }}</CTableHeaderCell>
    <CTableDataCell>{{ rowData.repository }}</CTableDataCell>
    <CTableDataCell>{{ rowData.images.length }}</CTableDataCell>
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
  