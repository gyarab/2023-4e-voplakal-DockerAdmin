<template>
  <CDropdown v-if="user" placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top">

        <CIcon icon="cil-user" /> Profile
        <!-- {{ user }} -->
      </CDropdownHeader>
      <CDropdownItem>
         {{ user.email }}
      </CDropdownItem>
      <CDropdownItem>
         {{ user.roles.join(" ") }}
      </CDropdownItem>

      <CDropdownDivider />

      <CDropdownItem @click="logout">
        <CIcon icon="cil-lock-locked" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar from '@/assets/images/user.png'
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  name: 'AppHeaderDropdownAccnt',
  setup() {
    const store = useStore();
    const router = useRouter();
    return {
      avatar: avatar,
      itemsCount: 42,
      logout: async () => {
        await store.dispatch("auth/logout");
        router.push("/login")
      },
      user: computed(() => store.state.auth.user)
    }
  },
}
</script>
