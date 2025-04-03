<script setup lang="ts">
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const members = [
  {
    id: 1,
    name: "mohammed Salem",
    role:"Emam",
    photo:"/images/Team_member_1.png"
  },
  {
    id: 2,
    name: "mohammed Salem",
    role:"Emam",
    photo:"/images/Team_member_2.png"
  },
  {
    id: 3,
    name: "mohammed Salem",
    role:"Emam",
    photo:"/images/Team_member_1.png"
  },
  {
    id: 4,
    name: "mohammed Salem",
    role:"Emam",
    photo:"/images/Team_member_2.png"
  },
  {
    id: 5,
    name: "mohammed Salem",
    role:"Emam",
    photo:"/images/Team_member_1.png"
  },
  {
    id: 6,
    name: "mohammed Salem",
    role:"Emam",
    photo:"/images/Team_member_2.png"
  },
  {
    id: 7,
    name: "mohammed Salem",
    role:"Emam",
    photo:"/images/Team_member_2.png"
  },
];

const currentMemberIndex = ref(0);

const itemsPerPage = ref(4);

const visibleMember = computed(() => {
  return members.slice(currentMemberIndex.value, currentMemberIndex.value + itemsPerPage.value);
});

function nextMemberPage() {
  if (currentMemberIndex.value + itemsPerPage.value < members.length) {
    currentMemberIndex.value += itemsPerPage.value;
  } else {
    currentMemberIndex.value = 0;
  }
}

function prevMemberPage() {
  if (currentMemberIndex.value - itemsPerPage.value >= 0) {
    currentMemberIndex.value -= itemsPerPage.value;
  } else {
    currentMemberIndex.value = members.length - itemsPerPage.value;
  }
}


</script>

<template>
  <section class="members-section">
    <div class="members-card-header">
      <h2 class="member-name">{{ t('members.title') }}</h2>
    </div>

    <div class="members-card-grid">
      <div class="members-card" v-for="member in visibleMember" :key="member.id">
        <div class="container">
          <img :src="member.photo" :alt="member.name" class="image" />
          <div class="overlay">
            <span class="text-role">{{member.name}}</span>
            <span class="text">{{member.role}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="buttons">
      <button @click="prevMemberPage" class="nav-button">
        <UIcon name="mdi-arrow-left" />
      </button>
      <button @click="nextMemberPage" class="nav-button">
        <UIcon name="mdi-arrow-right" />
      </button>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInOverlay {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.members-section {
  padding: 4rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 100%;
}

.members-card-header {
  margin-bottom: 1rem;
}

.member-name {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.members-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
}

.members-card {
  background: var(--bg-color);
  padding: 2rem 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  max-width: 100%;
  box-shadow: rgba(149, 157, 165, 0.3) 0 8px 24px;
  opacity: 0;
  animation: fadeIn 0.6s ease-in-out forwards;
}

.members-card:hover {
  transform: scale(1.05);
}

.container {
  position: relative;
  width: 100%;
  max-width: 300px;
}

.image {
  display: block;
  width: 100%;
  height: auto;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--secondary-color);
  opacity: 0.6;
  overflow: hidden;
  width: 0;
  height: 100%;
  transition: width 0.5s ease-in-out;
}

.container:hover .overlay {
  animation: slideInOverlay 0.5s forwards;
}

.text,
.text-role {
  white-space: nowrap;
  color: white;
  font-size: 18px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.text {
  top: 60%;
}

.text-role {
  top: 40%;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-button {
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.nav-button:hover {
  background-color: var(--secondary-color);
  transform: scale(1.05);
}


@media (max-width: 768px) {
  .members-section {
    padding: 2rem 1rem;
  }

  .member-name {
    font-size: 1.8rem;
  }

  .members-card-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .members-card {
    padding: 1.5rem;
  }

  .text,
  .text-role {
    font-size: 16px;
  }

  .nav-button {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .member-name {
    font-size: 1.6rem;
  }

  .members-card-grid {
    grid-template-columns: 1fr;
  }

  .members-card {
    padding: 1.2rem;
  }

  .text,
  .text-role {
    font-size: 14px;
  }

  .buttons {
    flex-direction: column;
    align-items: center;
  }

  .nav-button {
    width: 100%;
  }
}
</style>


