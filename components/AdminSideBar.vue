<script setup lang="ts">
import {onMounted, ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useNuxtApp} from "#app";

const isLoading = ref(true);
const userDetails = ref();
const isAdmin = computed(() => userDetails.value?.profile['staff_type'] == 'admin')
const isSuperAdmin = computed(() => userDetails.value?.profile['staff_type'] == 'super_admin')

onMounted(async () => {
  // try {
  //   const {$axios} = useNuxtApp();
  //   const {data} = await $axios().get('/users/me/');
  //   userDetails.value = data;
  //   console.log('User Details:', data);
  // } catch (error) {
  //   console.error('Error fetching user details:', error);
  // } finally {
  //   isLoading.value = false;
  // }
});

const router = useRouter();

async function navigateToPage(url: string, target: string) {
  isLoading.value = true;
  try {
    if (target === '_blank') {
      window.open(url, '_blank');
      isLoading.value = false;
    } else {
      await router.push(url);
      isLoading.value = false;
    }
  } catch (error) {
    console.error('Navigation error:', error);
    isLoading.value = false;
  }
}

const visibleButtonIndex = ref<number | null>(null);

const navigationButtons = [
  {
    forAdmin: false,
    forSuperAdmin: true,
    name: "Student",
    icon: "ph-student",
    links: [
      {text: "Register Student", url: "/student-registration-form", target: "_self"},
      {text: "Manage Student", url: "/student-registration-dashboard", target: "_self"},
    ],
  },
  {
    forAdmin: true,
    forSuperAdmin: true,
    name: "Maintenance",
    icon: "wpf-maintenance",
    links: [
      {text: "Maintenance Form", url: "/maintenance-room-form", target: "_blank"},
      {text: "Manage Maintenance", url: "/maintenance-room-dashboard", target: "_self"},
    ],
  },
];

const visibleButtons = computed(() =>
    navigationButtons.filter(button => {
      if (button.forAdmin && button.forSuperAdmin) {
        return isAdmin.value || isSuperAdmin.value;
      }
      if (button.forAdmin) {
        return isAdmin.value;
      }
      if (button.forSuperAdmin) {
        return isSuperAdmin.value;
      }
      return false;
    })
);

function toggleLinkVisibility(index: number) {
  visibleButtonIndex.value = visibleButtonIndex.value === index ? null : index;
}


</script>
<template>
  <aside class="navigation-panel">
    <div v-for="(button, index) in visibleButtons" :key="index">
      <div class="navigation-button-wrapper">
        <button
            @click="toggleLinkVisibility(index)"
            :aria-expanded="visibleButtonIndex === index"
            class="navigation-button"
        >
          <UIcon :name="button.icon"/>
          {{ button.name }}
        </button>
      </div>
      <ul v-if="visibleButtonIndex === index" class="navigation-links">
        <li
            v-for="(link, linkIndex) in button.links"
            :key="linkIndex"
            class="navigation-link-item"
        >
          <a
              @click.prevent="navigateToPage(link.url, link.target)"
              class="navigation-link"
              :target="link.target"
              style="cursor: pointer"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  display: block;
}

.navigation-panel {
  flex: 2;
  background-color: var(--primary-color);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

@media (max-width: 1200px) {
  .admin-sidebar {
    display: block;
  }

  .navigation-panel {
    min-height: 30vh;
  }
}

.navigation-button-wrapper {
  padding: 0.5rem;
  background-color: transparent;
}

.navigation-button-wrapper:hover {
  background-color: var(--text-color);
}

.navigation-button {
  font-size: 1rem;
  color: var(--text-hover);
  margin-bottom: 0.5rem;
  text-align: start;
  border-radius: 0.5rem;
  transition: 0.3s ease-in-out;
}

.navigation-button:hover {
  color: var(--text-hover);
}

.navigation-links {
  padding: 0;
  margin: 0;
  list-style: none;
}

.navigation-link-item {
  margin: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  text-align: start;
  text-transform: capitalize;
  font-weight: normal;
  color: var(--text-color);
  background-color: transparent;
}

.navigation-link-item:hover {
  color: var(--text-hover);
  background-color: var(--text-hover);
  transition: 0.3s ease-in-out;
}

.navigation-link {
  text-decoration: none;
  color: inherit;
}

@media (max-width: 768px) {
  .navigation-panel {
    flex-basis: 100%;
  }
}
</style>