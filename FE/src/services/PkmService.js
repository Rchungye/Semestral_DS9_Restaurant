import { ApiService } from './api.config'

export const GetAllPokemon = async () => {
    return ApiService.get('/pokemon/all')
      .then((response) => response.data)
      .catch((response) => Promise.resolve(response))
  }

  