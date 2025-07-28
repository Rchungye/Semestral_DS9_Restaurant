// src/routes/AdminRoutes.js
import { dishAdminRoutes } from "../modules/DishModule/DishRoute.js";
import { orderAdminRoutes } from "../modules/OrderModule/OrderRoute.js";
import { orderDetailAdminRoutes } from "../modules/OrderDetailModule/OrderDetailRoute.js";
import { promotionAdminRoutes } from "../modules/PromotionModule/PromotionRoute.js";
import { tableAdminRoutes } from "../modules/TableModule/TableRoute.js";
import { userAdminRoutes } from "../modules/UserModule/UserRoute.js";
import { transactionAdminRoutes } from "../modules/TransactionModule/TransactionRoute.js";

export default function (fastify) {
    dishAdminRoutes(fastify)
    orderAdminRoutes(fastify)
    orderDetailAdminRoutes(fastify)
    promotionAdminRoutes(fastify)
    tableAdminRoutes(fastify)
    userAdminRoutes(fastify)
    transactionAdminRoutes(fastify)
}