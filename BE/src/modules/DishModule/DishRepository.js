// src/modules/DishModule/DishRepository.js
import Dish from './DishModel.js'

export const getAllDishes = async () => {
  return await Dish.find()
}

export const getDishByIncrementalId = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  return await Dish.findOne({ idIncremental: id })
}

export const createDish = async (data) => {
  const nuevoPlatillo = new Dish(data)
  return await nuevoPlatillo.save()
}

export const updateDish = async (idIncremental, data) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  delete data.idIncremental
  return await Dish.findOneAndUpdate(
    { idIncremental: id },
    data,
    { new: true }
  )
}

export const deleteDish = async (idIncremental) => {
  const id = parseInt(idIncremental)
  if (isNaN(id) || id <= 0) {
    throw new Error('ID incremental inválido')
  }
  const resultado = await Dish.findOneAndDelete({ idIncremental: id })
  return resultado !== null
}

export const getAvailableDishes = async () => {
  return await Dish.find({ availability: true })
}