// src/routes/AdminRoutes.js
import { dishAdminRoutes } from "../modules/DishModule/DishRoutes.js";
import { orderAdminRoutes } from "../modules/OrderModule/OrderRoutes.js";
import { orderDetailAdminRoutes } from "../modules/OrderDetailModule/OrderDetailRoutes.js";
import { promotionAdminRoutes } from "../modules/PromotionModule/PromotionRoutes.js";
import { tableAdminRoutes } from "../modules/TableModule/TableRoutes.js";
import { userAdminRoutes } from "../modules/UserModule/UserRoutes.js";
import { transactionAdminRoutes } from "../modules/TransactionModule/TransactionRoutes.js";

export default function (fastify) {
    dishAdminRoutes(fastify)
    orderAdminRoutes(fastify)
    orderDetailAdminRoutes(fastify)
    promotionAdminRoutes(fastify)
    tableAdminRoutes(fastify)
    userAdminRoutes(fastify)
    transactionAdminRoutes(fastify)
}