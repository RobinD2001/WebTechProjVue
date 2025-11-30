import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import Home from "@/components/views/Home.vue";
import DailyCrossword from "@/components/views/DailyXWord.vue";
import Profile from "@/components/views/Profile.vue";
import Admin from "@/components/views/Admin.vue";

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
		path: "/profile",
		name: "profile",
		component: Profile,
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
});

router.beforeEach((to, from) => {
	const { isAuthenticated } = useAuth();
	if (to.meta.requiresAuth && !isAuthenticated.value) {
		return false;
	}

	return true;
});

export default router;
