import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import Home from "@/components/views/Home.vue";
import DailyCrossword from "@/components/views/DailyXWord.vue";
import Archive from "@/components/views/Archive.vue";
import Profile from "@/components/views/Profile.vue";
import Admin from "@/components/views/Admin.vue";
import Leaderboard from "@/components/views/Leaderboard.vue";
import HowTo from "@/components/views/HowTo.vue";

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
	},
	{
		path: "/daily",
		name: "daily",
		component: DailyCrossword,
	},
	{
		path: "/crossword",
		name: "crossword",
		component: Archive,
	},
	{
		path: "/profile",
		name: "profile",
		component: Profile,
	},
	{
		path: "/leaderboard",
		name: "leaderboard",
		component: Leaderboard,
	},
	{
		path: "/howto",
		name: "howto",
		component: HowTo,
	},
	{
		path: "/admin",
		name: "admin",
		component: Admin,
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { left: 0, top: 0 }; // scroll to top on each route change
  },
});

router.beforeEach((to, from) => {
	const { isAuthenticated } = useAuth();
	if (to.meta.requiresAuth && !isAuthenticated.value) {
		return false;
	}

	return true;
});

export default router;
