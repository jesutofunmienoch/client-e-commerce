// src/lib/appwrite.ts
import { Client, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your endpoint
  .setProject("69274bae003c6ee86b88"); // Replace with your Project ID

export const databases = new Databases(client);
export const DATABASE_ID = "ecommerce_db";
export const PRODUCTS_COLLECTION = "products";
export const ORDERS_COLLECTION = "orders";
export const STATS_COLLECTION = "stats"; // for total revenue

export { ID, Query };