// src/routes/ChefRoutes.js
import { orderChefRoutes } from "../modules/OrderModule/OrderRoutes.js";
import { orderDetailChefRoutes } from "../modules/OrderDetailModule/OrderDetailRoutes.js";

export default function (fastify) {
    orderChefRoutes(fastify)
    orderDetailChefRoutes(fastify)
}
