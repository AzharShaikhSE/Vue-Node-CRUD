<template>
  <v-app>
    <v-app-bar
      app
      color="green"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/hub_logo.jpeg"
          transition="scale-transition"
          width="40"
        />

        <span class="mr-2" style="font-size: 20px; text-align: center;">Hub Sample Order CRUD</span>
      </div>

      <v-spacer></v-spacer>

      <span class="mr-2">Welcome AZ</span>
    </v-app-bar>

    <v-main>
      <OrderGrid/> 
    </v-main>
  </v-app>
</template>

<script>
import OrderGrid from './components/OrderGrid';

export default {
  name: 'App',

  components: {
    OrderGrid,
  },

};
</script>
