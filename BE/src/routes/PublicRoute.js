// src/routes/PublicRoutes.js
import { dishPublicRoutes } from "../modules/DishModule/DishRoute.js";
import { orderPublicRoutes } from "../modules/OrderModule/OrderRoute.js";
import { orderDetailPublicRoutes } from "../modules/OrderDetailModule/OrderDetailRoute.js";
import { promotionPublicRoutes } from "../modules/PromotionModule/PromotionRoute.js";
import { tablePublicRoutes } from "../modules/TableModule/TableRoute.js";
import { transactionPublicRoutes } from "../modules/TransactionModule/TransactionRoute.js";
import { emailPublicRoutes } from "../modules/EmailModule/EmailRoute.js";

export default function (fastify) {
    dishPublicRoutes(fastify)
    orderPublicRoutes(fastify)
    orderDetailPublicRoutes(fastify)
    promotionPublicRoutes(fastify)
    tablePublicRoutes(fastify)
    transactionPublicRoutes(fastify)
    emailPublicRoutes(fastify)
}