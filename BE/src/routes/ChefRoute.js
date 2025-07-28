// src/routes/ChefRoutes.js
import { orderChefRoutes } from "../modules/OrderModule/OrderRoute.js";
import { orderDetailChefRoutes } from "../modules/OrderDetailModule/OrderDetailRoute.js";

export default function (fastify) {
    orderChefRoutes(fastify)
    orderDetailChefRoutes(fastify)
}
