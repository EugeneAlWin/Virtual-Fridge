import { RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
import UserRequestError from '../errors/userRequestError'

import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import RecipeService from '../services/recipeService'
import {
	IGetRecipeByIdRequest,
	IGetRecipeByIdResponse,
} from '../api/recipes/dto/getRecipeById'
import {
	IGetAllRecipesRequest,
	IGetAllRecipesResponse,
} from '../api/recipes/dto/getAllRecipes'
import {
	ICreateRecipeRequest,
	ICreateRecipeResponse,
} from '../api/recipes/dto/createRecipe'
import {
	IUpdateRecipeRequest,
	IUpdateRecipeResponse,
} from '../api/recipes/dto/updateRecipe'
import {
	IDeleteRecipesRequest,
	IDeleteRecipesResponse,
} from '../api/recipes/dto/deleteRecipe'
import {
	IGetAllChosenRecipesRequest,
	IGetAllChosenRecipesResponse,
} from '../api/recipes/dto/getAllChosenRecipes'
import {
	IGetAllFavoriteRecipesRequest,
	IGetAllFavoriteRecipesResponse,
} from '../api/recipes/dto/getAllFavoriteRecipes'
import {
	ICreateChosenRecipeRequest,
	ICreateChosenRecipeResponse,
} from '../api/recipes/dto/createChosenRecipe'
import {
	IUpdateChosenRecipeRequest,
	IUpdateChosenRecipeResponse,
} from '../api/recipes/dto/updateChosenRecipe'
import {
	ICreateFavoriteRecipeRequest,
	ICreateFavoriteRecipeResponse,
} from '../api/recipes/dto/createFavoriteRecipe'
import {
	IDeleteChosenRecipesRequest,
	IDeleteChosenRecipesResponse,
} from '../api/recipes/dto/deleteChosenRecipe'
import {
	IDeleteFavoriteRecipesRequest,
	IDeleteFavoriteRecipesResponse,
} from '../api/recipes/dto/deleteFavoriteRecipe'

export default class RecipeController {
	//get
	static getRecipeById: RequestHandler<
		undefined,
		IGetRecipeByIdResponse | IErrorResponse,
		IGetRecipeByIdRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.getRecipeById(req.body)
			if (!result)
				return next(
					UserRequestError.NotFound(
						`RECIPE WITH ID ${req.body.id} NOT FOUND`
					)
				)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static getAllRecipes: RequestHandler<
		undefined,
		IGetAllRecipesResponse | IErrorResponse,
		IGetAllRecipesRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.getAllRecipes(req.body)
			res.json({
				recipesData: result,
				cursor: result[result.length - 1]?.id || null,
			})
		} catch (e) {
			return next(e)
		}
	}

	static getAllChosenRecipes: RequestHandler<
		undefined,
		IGetAllChosenRecipesResponse | IErrorResponse,
		IGetAllChosenRecipesRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.getAllChosenRecipes(req.body)
			res.json({
				chosenRecipesData: result.map(record => ({
					info: {
						chosenRecipeId: record.id,
						recipeId: record.recipeId,
						userId: record.userId,
						isCooked: record.isCooked,
						createdAt: record.createdAt,
					},
					recipeDataPreview: record.recipe,
				})),
				cursor: result[result.length - 1]?.id || null,
			})
		} catch (e) {
			return next(e)
		}
	}

	static getAllFavoriteRecipes: RequestHandler<
		undefined,
		IGetAllFavoriteRecipesResponse | IErrorResponse,
		IGetAllFavoriteRecipesRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.getAllFavoriteRecipes(req.body)
			res.json({
				favoriteRecipesData: result.map(record => ({
					info: {
						favoriteRecipeId: record.id,
						recipeId: record.recipeId,
						userId: record.userId,
					},
					recipeDataPreview: record.recipe,
				})),
				cursor: result[result.length - 1]?.id || null,
			})
		} catch (e) {
			return next(e)
		}
	}

	//create
	static createRecipe: RequestHandler<
		undefined,
		ICreateRecipeResponse | IErrorResponse,
		ICreateRecipeRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.createRecipe(req.body)
			res.status(201).json(result)
		} catch (e) {
			return next(e)
		}
	}

	static createChosenRecipe: RequestHandler<
		undefined,
		ICreateChosenRecipeResponse | IErrorResponse,
		ICreateChosenRecipeRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.createChosenRecipe(req.body)
			res.status(201).json(result)
		} catch (e) {
			return next(e)
		}
	}

	static createFavoriteRecipe: RequestHandler<
		undefined,
		ICreateFavoriteRecipeResponse | IErrorResponse,
		ICreateFavoriteRecipeRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.createFavoriteRecipe(req.body)
			res.status(201).json(result)
		} catch (e) {
			return next(e)
		}
	}

	//update
	static updateRecipeData: RequestHandler<
		undefined,
		IUpdateRecipeResponse | IErrorResponse,
		IUpdateRecipeRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.updateRecipe(req.body)
			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static updateChosenRecipe: RequestHandler<
		undefined,
		IUpdateChosenRecipeResponse | IErrorResponse,
		IUpdateChosenRecipeRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.updateChosenRecipe(req.body)
			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	//delete
	static deleteRecipes: RequestHandler<
		undefined,
		IDeleteRecipesResponse | IErrorResponse,
		IDeleteRecipesRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.deleteRecipes(req.body)

			if (result.count === 0)
				return next(UserRequestError.NotFound('NO RECIPES WERE FOUND'))

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static deleteChosenRecipes: RequestHandler<
		undefined,
		IDeleteChosenRecipesResponse | IErrorResponse,
		IDeleteChosenRecipesRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.deleteChosenRecipes(req.body)

			if (result.count === 0)
				return next(UserRequestError.NotFound('NO RECIPES WERE FOUND'))

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static deleteFavoriteRecipes: RequestHandler<
		undefined,
		IDeleteFavoriteRecipesResponse | IErrorResponse,
		IDeleteFavoriteRecipesRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await RecipeService.deleteFavoriteRecipes(req.body)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}
}
