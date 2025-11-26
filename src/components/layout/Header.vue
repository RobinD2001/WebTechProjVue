<script setup>
  import { ref } from "vue";
  import Auth from "@/components/auth/Auth.vue";
  import {useAuth} from "@/composables/useAuth"; 
  
  const { isAuthenticated } = useAuth();
  const showAuth = ref(false)
  function openAuth() {
  showAuth.value = true;
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary mb">
    <div class="container-fluid">
      <a class="navbar-brand" href="/"><img src="/favicon-32x32.png"></img></a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/"
              >Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'daily' }"
              >Daily Puzzle
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'daily' }"
              >Archive
            </router-link>
          </li>
        </ul>
        <div class="d-flex">
          <router-link v-if="isAuthenticated" class="nav-link" :to="{ name: 'profile' }">Profile</router-link>
          <button v-else class="btn btn-text" @click="openAuth">Login</button>
        </div>
      </div>
    </div>
  </nav>
  <Auth v-model="showAuth"/>
</template>
