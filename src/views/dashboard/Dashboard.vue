<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="5">
                <h4 id="traffic" class="card-title mb-0">Traffic</h4>
                <div class="small text-body-secondary">January 2021</div>
              </CCol>
              <CCol :sm="7" class="d-none d-md-block">
                <CButton color="primary" class="float-end">
                  <CIcon icon="cil-cloud-download" />
                </CButton>
              </CCol>
            </CRow>
            <br>
            <CRow>
              <CCol><p>ahhoj</p></CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol>
                <div class="text-body-secondary">Test</div>
                <div class="fw-semibold text-truncate">29.703 Users (40%)</div>
                <CProgress class="mt-2" color="success" thin :precision="1" :value="40" />
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader> Traffic &amp; Sales </CCardHeader>
          <CCardBody>
            Body
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  components: {
  },
  setup() {
    
    return {
    }
  },
}
</script>
