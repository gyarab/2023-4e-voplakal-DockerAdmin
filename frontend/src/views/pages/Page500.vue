<template>
  <div class="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <span class="clearfix">
            <h1 class="float-start display-3 me-4">500</h1>
            <h4 class="pt-3">Houston, we have a problem!</h4>
            <p class="text-body-secondary float-start">
              We apologize for the inconvenience, but there has been an unexpected server error.
            </p>
          </span>
          <br>
          <RouterLink to="/dashboard">
            <CButton color="primary" size="lg">Back to dashboard</CButton>
          </RouterLink>

        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>

export default {
  name: 'Page500',
  setup() {

  }
}
</script>
