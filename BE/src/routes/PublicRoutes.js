// src/reoutes/PublicRoutes.js
import { dishPublicRoutes } from "../modules/DishModule/DishRoutes.js";
import { orderPublicRoutes } from "../modules/OrderModule/OrderRoutes.js";
import { orderDetailPublicRoutes } from "../modules/OrderDetailModule/OrderDetailRoutes.js";
import { promotionPublicRoutes } from "../modules/PromotionModule/PromotionRoutes.js";
import { tablePublicRoutes } from "../modules/TableModule/TableRoutes.js";
import { transactionPublicRoutes } from "../modules/TransactionModule/TransactionRoutes.js";

export default function (fastify) {
    dishPublicRoutes(fastify)
    orderPublicRoutes(fastify)
    orderDetailPublicRoutes(fastify)
    promotionPublicRoutes(fastify)
    tablePublicRoutes(fastify)
    transactionPublicRoutes(fastify)
}