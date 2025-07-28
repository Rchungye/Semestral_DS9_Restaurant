// src/modules/DishModule/DishServices.js
import * as dishRepo from './DishRepository.js'

export const listDishes = async (request, reply) => {
    try {
        const dishes = await dishRepo.getAllDishes()
        return dishes
    } catch (error) {
        return reply.code(500).send({ error: 'Error retrieving dishes' })
    }
}

export const getDish = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const dish = await dishRepo.getDishByIncrementalId(idIncremental)
        if (!dish) {
            return reply.code(404).send({ error: 'Dish not found' })
        }
        return dish
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        return reply.code(500).send({ error: 'Error retrieving dish' })
    }
}

export const createDish = async (request, reply) => {
    try {
        const data = request.body
        if (!data.name || data.price == null || !data.category) {
            return reply.code(400).send({ error: 'Missing required fields: name, price, category' })
        }
        const newDish = await dishRepo.createDish(data)
        return reply.code(201).send(newDish)
    } catch (error) {
        if (error.code === 11000) {
            return reply.code(409).send({ error: 'Dish name already exists' })
        }
        return reply.code(500).send({ error: 'Error creating dish' })
    }
}

export const updateDish = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const data = request.body
        const updatedDish = await dishRepo.updateDish(idIncremental, data)
        if (!updatedDish) {
            return reply.code(404).send({ error: 'Dish not found' })
        }
        return updatedDish
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        if (error.code === 11000) {
            return reply.code(409).send({ error: 'Dish name already exists' })
        }
        return reply.code(500).send({ error: 'Error updating dish' })
    }
}

export const deleteDish = async (request, reply) => {
    try {
        const idIncremental = request.params.id
        const deleted = await dishRepo.deleteDish(idIncremental)
        if (!deleted) {
            return reply.code(404).send({ error: 'Dish not found' })
        }
        return reply.code(200).send({
            message: 'Dish deleted successfully',
            id: parseInt(idIncremental)
        })
    } catch (error) {
        if (error.message === 'ID incremental inválido') {
            return reply.code(400).send({ error: 'Invalid incremental ID' })
        }
        return reply.code(500).send({ error: 'Error deleting dish' })
    }
}

export const getAvailableDishes = async (request, reply) => {
    try {
        const dishes = await dishRepo.getAvailableDishes()
        return dishes
    } catch (error) {
        return reply.code(500).send({ error: 'Error retrieving available dishes' })
    }
}