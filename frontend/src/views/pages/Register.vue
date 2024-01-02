<template>
  <div class="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm :onsubmit="() => { register(); return false }">
                <h1>Register</h1>
                <p class="text-body-secondary">Create your account</p>
                <!-- <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput placeholder="Username" autocomplete="username" required v-model="fullName" />
                </CInputGroup> -->
                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput placeholder="Email" autocomplete="email" type="email" required v-model="email" />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput type="password" placeholder="Password" autocomplete="new-password" required v-model="pass1" />
                </CInputGroup>
                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput type="password" placeholder="Repeat password" autocomplete="new-password" v-model="pass2" />
                </CInputGroup>
                <div class="d-grid">
                  <CButton color="success" type="submit">Create Account</CButton>
                </div>
              </CForm>
              <p class="text-body-secondary">Do you have an account? <RouterLink to="/login">Log in</RouterLink>
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>


  <CModal :visible="passNotMatch" @close="() => { passNotMatch = false }">
    <CModalHeader>
      <CModalTitle>Passwords do not match</CModalTitle>
    </CModalHeader>
    <CModalBody>Please make you sure that the both filled passwords are the same!</CModalBody>
    <CModalFooter>
      <CButton color="primary" @click="() => { passNotMatch = false }">
        Close
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Register',
  setup() {
    const store = useStore();
    const router = useRouter();
    let fullName = ref("");
    let email = ref("");
    let pass1 = ref("");
    let pass2 = ref("");
    let passNotMatch = ref(false);

    let register = async () => {
      if (pass1.value !== pass2.value) {
        passNotMatch.value = true; return
      }
      store.dispatch("auth/register", {
        username: email.value,
        email: email.value,
        password: pass1.value
      }).then(() => {
        router.push("login");
        window.showToast("Please login")
      })
    };





    return {
      register, fullName, email, pass1, pass2, passNotMatch
    };
  },
  components: { RouterLink }
}
</script>
