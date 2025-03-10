import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Dashboard from "@/views/Dashboard.vue";
import Venue from "@/views/Venue.vue";
import Organizer from "@/views/Organizer.vue";
import Event from "@/views/Event.vue";
import SignIn from '@/views/Signin.vue';
import SignUp from '@/views/Signin.vue';


const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "signin", component: SignIn},
      { path: "signup", component: SignUp },
      { path: "dashboard", component: Dashboard },
      { path: "organizer", component: Organizer },
      { path: "venue", component: Venue },
      { path: "event", component: Event },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
