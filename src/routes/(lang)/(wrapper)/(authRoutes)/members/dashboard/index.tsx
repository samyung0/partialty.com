import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

import Dashboard from "~/components/_Dashboard";
import { useUserLoader } from "~/routes/(lang)/(wrapper)/(authRoutes)/layout";

export default component$(() => {
  const user = useUserLoader();

  return (
    <main class="">
      <Dashboard user={user.value}></Dashboard>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Dashboard",
  meta: [
    {
      name: "description",
      content: "Members dashboard for Partialty.com",
    },
  ],
};