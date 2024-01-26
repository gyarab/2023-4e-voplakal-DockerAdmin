<template>
  <div class="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm :onsubmit="() => { login(); return false }">
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput placeholder="E-mail" type="email" autocomplete="username" required v-model="username" />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput type="password" placeholder="Password" autocomplete="current-password" required v-model="passwd" />
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
  <!-- LOST PASS -->
  <CModal :visible="lostPassModal" @close="() => { lostPassModal = false }">
    <CModalHeader>
      <CModalTitle>Please enter you email adress</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm :onsubmit="() => { sendLostPass(lostPassEmail); return false }">
        <CFormInput type="email" autocomplete="email" required v-model="lostPassEmail"></CFormInput>
        <CModalFooter>
          <CButton color="secondary" @click="() => { lostPassModal = false }">
            Close
          </CButton>
          <CButton color="primary" @click="sendNewPass" type="submit">Send</CButton>
        </CModalFooter>
      </CForm>
    </CModalBody>
  </CModal>
  <!-- CREATE NEW PASS -->
  <CModal :visible="newPassModal" @close="() => { newPassModal = false }">
    <CModalHeader>
      <CModalTitle>Please enter you new password</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm :onsubmit="() => { createNewPass(newPass); return false }">
        <CFormInput type="password" autocomplete="password" required v-model="newPass"></CFormInput>
        <CModalFooter>
          <CButton color="secondary" @click="() => { newPassModal = false }">
            Close
          </CButton>
          <CButton color="primary" @click="sendNewPass" type="submit">OK</CButton>
        </CModalFooter>
      </CForm>
    </CModalBody>
  </CModal>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex';
export default {
  name: 'Login',
  props: {
    token: {
      type: String,
      requied: false
    },
  },
  setup(props) {
    let username = ref("");
    let passwd = ref("");
    let wrongCreditals = ref({ show: false, message: "" })

    let lostPassModal = ref(false);
    let sendNewPass = () => { };

    const store = useStore();
    // const loggedIn = computed(() => store.state.auth.status.loggedIn)
    const user = computed(() => store.state.auth.user)

    const login = async () => {
      await store.dispatch("auth/login", {
        username: username.value,
        password: passwd.value
      })
      router.push("/")
    }

    const sendLostPass = async (email) => {
      await store.dispatch("auth/forgottenPasswd", email);
      lostPassModal.value = false;
    }

    const newPassModal = ref();
    console.log(props.token);

    onMounted(() => {
      newPassModal.value = !!props.token
    })

    const createNewPass = async (newPass) => {
      await store.dispatch("auth/createNewPass", {
        newPass,
        token: props.token
      })
      newPassModal.value = false;
    }


    return {
      username, passwd, wrongCreditals, login, lostPassModal, sendNewPass, user, lostPassEmail: ref(), sendLostPass, newPass: ref(), createNewPass, newPassModal
    }
  }
}
</script>
