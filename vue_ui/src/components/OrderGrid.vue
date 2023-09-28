<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="orders"
      :sort-by="['orderId']"
      class="elevation-1 padded-table"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My Orders</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openEditDialog(null)">New Order</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="openEditDialog(item)">mdi-pencil</v-icon>
        <v-icon @click="openDeleteDialog(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Edit Order Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>{{
          editMode ? "Edit Order" : "Add New Order"
        }}</v-card-title>
        <v-card-text>
          <!-- Add/Edit Order Form Fields -->
          <v-text-field
            v-model="editedOrder.orderId"
            label="Order ID"
          ></v-text-field>
          <v-select
            v-model="editedOrder.orderStatus"
            :items="[
              'OPEN',
              'ACCEPTED',
              'DISPATCHED',
              'RAILBILLED',
              'PICKUP',
              'DELIVERED',
              'COMPLETED'
            ]"
            label="Order Status"
          ></v-select>
          <v-text-field
            v-model="editedOrder.source"
            label="source"
          ></v-text-field>
          <v-text-field
            v-model="editedOrder.destination"
            label="Destination"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveOrder">Save</v-btn>
          <v-btn color="blue darken-1" text @click="closeEditDialog"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete Order</v-card-title>
        <v-card-text> Are you sure you want to delete this order? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteOrder">OK</v-btn>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios"; // Assuming you're using axios for HTTP requests

export default {
  data() {
    return {
      editedOrder: {
        orderId: "",
        orderStatus: "",
        source: "",
        destination: ""
      },
      headers: [
        {
          text: "Order ID",
          value: "orderId"
        },
        { text: "Order Status", value: "orderStatus" },
        { text: "Origin", value: "source" },
        { text: "Destination", value: "destination" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      editDialog: false,
      deleteDialog: false,
      editMode: false,
      orders: []
    };
  },
  methods: {
    async openEditDialog(order) {
      this.editedOrder = order
        ? Object.assign({}, order)
        : {
            orderId: "",
            orderStatus: "",
            source: "",
            destination: ""
          };
      this.editMode = !!order;
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    async saveOrder() {
      if (this.editMode) {
        // Update existing order
        // Delete the mongodb _id as it's immutable
        delete this.editedOrder._id;
        await axios.put(
          `http://localhost:3000/api/orders/${this.editedOrder.orderId}`,
          this.editedOrder
        );
      } else {
        // Create new order
        await axios.post("http://localhost:3000/api/orders", this.editedOrder);
      }
      this.fetchOrders();
      this.closeEditDialog();
    },
    openDeleteDialog(order) {
      this.editedOrder = Object.assign({}, order);
      this.deleteDialog = true;
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
    },
    async deleteOrder() {
      await axios.delete(
        `http://localhost:3000/api/orders/${this.editedOrder.orderId}`
      );
      this.fetchOrders();
      this.closeDeleteDialog();
    },
    async fetchOrders() {
      const response = await axios.get("http://localhost:3000/api/orders");
      this.orders = response.data;
      console.log("## this orders:", this.orders);
    }
  },
  created() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
.padded-table {
  padding: 30px;
}
</style>
