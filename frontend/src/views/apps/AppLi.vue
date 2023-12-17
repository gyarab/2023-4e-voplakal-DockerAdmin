<template>
    <CTableRow v-for="item in data" :key="item.id">
        <CTableHeaderCell scope="row">{{ item.repository }}</CTableHeaderCell>
        <CTableDataCell>{{ item.tag }}</CTableDataCell>
        <CTableDataCell>{{ item.created }}</CTableDataCell>
        <CTableDataCell>{{ item.size }}</CTableDataCell>
        <CTableDataCell>{{ item.image_id }}</CTableDataCell>
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

export default {
    name: "AppLi",
    props: {
        data: {
            type: Array,
            default: []
        },
    },
    components: {
    },
    setup(context) {

        context.data.push({
            id: "12345677",
            repository: 'biobrejn-2',
            tag: 'latest',
            image_id: '08af2227f359',
            created: '7 weeks ago',
            size: '340 MB',
        })
        return {

        }
    }
}
</script>
  