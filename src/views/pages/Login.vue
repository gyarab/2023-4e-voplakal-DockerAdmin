<template>
  <div class="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm :onsubmit="login">
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" autocomplete="username" required />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput type="password" placeholder="Password" autocomplete="current-password" required />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" type="submit"> Login </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0" @click="lostPassModal = true">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <RouterLink to="/register">
                    <CButton color="light" variant="outline" class="mt-3">
                      Register Now!
                    </CButton>
                  </RouterLink>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>

  <!-- WRONG CREADIALS -->
  <CModal :visible="wrongCreditals" @close="() => { wrongCreditals = false }">
    <CModalHeader>
      <CModalTitle>Passwords do not match</CModalTitle>
    </CModalHeader>
    <CModalBody>Please make you sure you use rigth creditals and try again!</CModalBody>
    <CModalFooter>
      <CButton color="primary" @click="() => { wrongCreditals = false }">
        Close
      </CButton>
    </CModalFooter>
  </CModal>

  <!-- LOST PASS -->
  <CModal :visible="lostPassModal" @close="() => { lostPassModal = false }">
    <CModalHeader>
      <CModalTitle>Please enter you email adress</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm onsubmit="() => false">
        <CFormInput type="email" autocomplete="email" required></CFormInput>
        <CModalFooter>
          <CButton color="secondary" @click="() => { lostPassModal = false }">
            Close
          </CButton>
          <CButton color="primary" @click="sendNewPass" type="submit">Send</CButton>
        </CModalFooter>
      </CForm>
    </CModalBody>
  </CModal>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'Login',
  setup() {
    let email = ref("");
    let pass = ref("");
    let wrongCreditals = ref(false)
    let login = () => {
      wrongCreditals.value = true;
    }
    let lostPassModal = ref(false);
    let sendNewPass = () => {};
    return {
      email, pass, wrongCreditals, login, lostPassModal, sendNewPass
    }
  }
}
</script>
