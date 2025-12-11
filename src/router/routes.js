import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import Home from "@/components/views/Home.vue";
import DailyCrossword from "@/components/views/DailyXWord.vue";
import Archive from "@/components/views/Archive.vue";
import Profile from "@/components/views/Profile.vue";
import Admin from "@/components/views/Admin.vue";
import Leaderboard from "@/components/views/Leaderboard.vue";
import HowTo from "@/components/views/HowTo.vue";
import NotFound from "@/components/layout/NotFound.vue";
import { randomArchiveDate } from "@/utils/date";
import i18n, { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n";
import ForgotPassword from "@/components/auth/ForgotPassword.vue";
import ResetPassword from "@/components/auth/ResetPassword.vue";

const ARCHIVE_START_DATE = "2025-12-01";

const routes = [
	{
		path: "/",
		redirect: { name: "home", params: { locale: DEFAULT_LOCALE } },
	},
	{
		path: "/:locale(en|de)",
		name: "home",
		component: Home,
	},
	{
		path: "/:locale(en|de)/daily",
		name: "daily",
		component: DailyCrossword,
	},
	{
		path: "/:locale(en|de)/crossword",
		name: "crossword",
		component: Archive,
	},
	{
		path: "/:locale(en|de)/crossword/:date",
		name: "crosswordSelect",
		component: Archive,
		props: (route) => ({ date: route.params.date }),
	},
	{
		path: "/:locale(en|de)/random",
		name: "random",
		redirect: (to) => ({
			name: "crosswordSelect",
			params: {
				locale: to.params.locale,
				date: randomArchiveDate(ARCHIVE_START_DATE),
			},
		}),
	},
	{
		path: "/:locale(en|de)/profile",
		name: "profile",
		component: Profile,
	},
	{
		path: "/:locale(en|de)/leaderboard",
		name: "leaderboard",
		component: Leaderboard,
	},
	{
		path: "/:locale(en|de)/howto",
		name: "howto",
		component: HowTo,
	},
	{
		path: "/:locale(en|de)/admin",
		name: "admin",
		component: Admin,
		meta: { requiresAuth: true },
	},
	{
		path: "/:locale(en|de)/404",
		name: "404",
		component: NotFound,
	},
	{
		path: "/:locale(en|de)/forgotpassword",
		name: "pwforgot",
		component: ForgotPassword,
	},
	{
		path: "/:locale(en|de)/resetpassword/:token",
		name: "pwreset",
		component: ResetPassword,
		props: (route) => ({ token: route.params.token }),
	},
	{
		path: "/:locale(en|de)/:catchAll(.*)*",
		redirect: (to) => ({ name: "404", params: { locale: to.params.locale } }),
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: { name: "home", params: { locale: DEFAULT_LOCALE } },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;
		return { left: 0, top: 0 };
	},
});

router.beforeEach((to) => {
	const localeParam = to.params.locale;
	const locale = Array.isArray(localeParam) ? localeParam[0] : localeParam;

	if (!SUPPORTED_LOCALES.includes(locale)) {
		return { name: "home", params: { locale: DEFAULT_LOCALE } };
	}

	if (i18n.global.locale.value !== locale) {
		i18n.global.locale.value = locale;
	}

	const { isAuthenticated } = useAuth();
	if (to.meta.requiresAuth && !isAuthenticated.value) {
		return false;
	}

	return true;
});

export default router;
