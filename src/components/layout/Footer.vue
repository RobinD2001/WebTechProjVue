<script setup>
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
</script>

<template>
  <footer class="mt-auto">
    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-3">
          <h5>About Us</h5>
          <p>
            A crossword a day keeps the doctor away. From monday to sunday you
            will get a new mini crossword handpicked by our editing staff.
            Please enjoy your time here and join the community of puzzle
            enthusiasts.
          </p>
        </div>
        <div class="col-md-4 mb-3">
          <h5>Quick Links</h5>
          <ul class="list-unstyled">
            <li>
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li>
              <router-link class="nav-link" :to="{ name: 'daily' }"
                >Daily Puzzle</router-link
              >
            </li>
            <li>
              <router-link class="nav-link" :to="{ name: 'daily' }"
                >Archive</router-link
              >
            </li>
          </ul>
        </div>
        <div class="col-md-4 mb-3">
          <h5>Follow Us</h5>
          <ul class="list-inline social-icons">
            <li class="list-inline-item">
              <a href="https://www.facebook.com" class="text-dark">
                <font-awesome-icon :icon="faFacebook" />
              </a>
            </li>
            <li class="list-inline-item">
              <a href="https://www.x.com" class="text-dark">
                <font-awesome-icon :icon="faXTwitter"
              /></a>
            </li>
            <li class="list-inline-item">
              <a href="https://www.instagram.com" class="text-dark">
                <font-awesome-icon :icon="faInstagram" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr class="mb-4" />
      <div class="row">
        <div class="col-md-12 text-center">
          <p>&copy; 2025 Daily Crosswords. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.social-icons a {
  font-size: 1rem;
}
</style>
