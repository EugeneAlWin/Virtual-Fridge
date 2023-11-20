import prismaClient from '../prismaClient'
import UserRequestError from '../errors/userRequestError'
import { IGetRecipeByIdRequest } from '../api/recipes/dto/getRecipeById'
import { IGetAllRecipesRequest } from '../api/recipes/dto/getAllRecipes'
import { ICreateRecipeRequest } from '../api/recipes/dto/createRecipe'
import { IUpdateRecipeRequest } from '../api/recipes/dto/updateRecipe'
import { IDeleteRecipesRequest } from '../api/recipes/dto/deleteRecipe'
import { IGetAllFavoriteRecipesRequest } from '../api/recipes/dto/getAllFavoriteRecipes'
import { IGetAllChosenRecipesRequest } from '../api/recipes/dto/getAllChosenRecipes'
import { ICreateChosenRecipeRequest } from '../api/recipes/dto/createChosenRecipe'
import { ICreateFavoriteRecipeRequest } from '../api/recipes/dto/createFavoriteRecipe'
import { IUpdateChosenRecipeRequest } from '../api/recipes/dto/updateChosenRecipe'
import { IDeleteFavoriteRecipesRequest } from '../api/recipes/dto/deleteFavoriteRecipe'
import { IDeleteChosenRecipesRequest } from '../api/recipes/dto/deleteChosenRecipe'

export default class RecipeService {
	//get
	static getRecipeById = async ({ id }: IGetRecipeByIdRequest) =>
		prismaClient.recipe.findUnique({
			where: { id },
			include: { recipeComposition: true },
		})

	static getAllRecipes = async ({
		title,
		cursor,
		skip,
		take,
		isVisible,
		isApproved,
	}: IGetAllRecipesRequest) =>
		prismaClient.recipe.findMany({
			skip,
			take,
			cursor: cursor ? { id: cursor } : undefined,
			where: {
				title: title ? { contains: title, mode: 'insensitive' } : undefined,
				isVisible: isVisible === undefined ? true : isVisible,
				isApproved: isVisible === undefined ? true : isApproved,
			},
			include: { recipeComposition: true },
		})

	static getAllChosenRecipes = async ({
		title,
		cursor,
		skip,
		take,
		userId,
	}: IGetAllChosenRecipesRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: userId },
			select: { id: true },
		})

		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${userId} NOT FOUND`)

		return prismaClient.chosenRecipe.findMany({
			skip,
			take,
			cursor: cursor ? { id: cursor } : undefined,
			where: {
				userId,
				recipe: {
					title: title
						? { contains: title, mode: 'insensitive' }
						: undefined,
				},
			},
			include: { recipe: true },
		})
	}

	static getAllFavoriteRecipes = async ({
		title,
		cursor,
		skip,
		take,
		userId,
	}: IGetAllFavoriteRecipesRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: userId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${userId} NOT FOUND`)

		return prismaClient.favoriteRecipe.findMany({
			skip,
			take,
			cursor: cursor ? { id: cursor } : undefined,
			where: {
				userId,
				recipe: {
					title: title
						? { contains: title, mode: 'insensitive' }
						: undefined,
				},
			},
			include: { recipe: true },
		})
	}

	//create
	static createRecipe = async ({
		recipeComposition,
		isVisible,
		description,
		type,
		title,
		creatorId,
	}: ICreateRecipeRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: creatorId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${creatorId} NOT FOUND`)

		return prismaClient.recipe.create({
			data: {
				title,
				creatorId,
				isVisible,
				description,
				type,
				recipeComposition: {
					createMany: {
						data: recipeComposition.map(record => ({
							productId: record.productId,
							quantity: record.quantity,
						})),
					},
				},
			},
			include: { recipeComposition: true },
		})
	}

	static createChosenRecipe = async ({
		userId,
		recipeId,
	}: ICreateChosenRecipeRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: userId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${userId} NOT FOUND`)

		const recipe = await prismaClient.recipe.findUnique({
			where: { id: recipeId },
			select: { id: true },
		})
		if (!recipe)
			throw UserRequestError.NotFound(`RECIPE WITH ID ${recipeId} NOT FOUND`)

		return prismaClient.chosenRecipe.create({
			data: { userId, recipeId },
		})
	}

	static createFavoriteRecipe = async ({
		userId,
		recipeId,
	}: ICreateFavoriteRecipeRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: userId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${userId} NOT FOUND`)

		const recipe = await prismaClient.recipe.findUnique({
			where: { id: recipeId },
			select: { id: true },
		})
		if (!recipe)
			throw UserRequestError.NotFound(`RECIPE WITH ID ${recipeId} NOT FOUND`)

		return prismaClient.favoriteRecipe.create({
			data: { userId, recipeId },
		})
	}

	//update
	static updateRecipe = async ({
		id,
		title,
		creatorId,
		recipeComposition,
		isVisible,
		isApproved,
		description,
		type,
	}: IUpdateRecipeRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: creatorId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${creatorId} NOT FOUND`)

		const recipe = await prismaClient.recipe.findUnique({
			where: { id },
			select: { id: true },
		})
		if (!recipe)
			throw UserRequestError.NotFound(`RECIPE WITH ID ${id} NOT FOUND`)

		return prismaClient.recipe.update({
			where: { id },
			data: {
				title,
				isVisible,
				isApproved,
				description,
				type,
				recipeComposition: !recipeComposition
					? undefined
					: {
							deleteMany: { recipeId: { equals: id } },
							createMany: {
								data: recipeComposition.map(record => ({
									productId: record.productId,
									quantity: record.quantity,
								})),
							},
					  },
			},
			include: { recipeComposition: true },
		})
	}

	static updateChosenRecipe = async ({
		chosenRecipeId,
		userId,
		isCooked,
	}: IUpdateChosenRecipeRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: userId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${userId} NOT FOUND`)

		const recipe = await prismaClient.chosenRecipe.findUnique({
			where: { id: chosenRecipeId },
			select: { id: true },
		})
		if (!recipe)
			throw UserRequestError.NotFound(
				`CHOSEN RECIPE WITH ID ${chosenRecipeId} NOT FOUND`
			)

		return prismaClient.chosenRecipe.update({
			where: { userId, id: chosenRecipeId },
			data: { isCooked },
		})
	}

	//delete
	static deleteRecipes = async ({
		recipesId,
		userId,
	}: IDeleteRecipesRequest) =>
		prismaClient.recipe.deleteMany({
			where: {
				id: { in: recipesId },
				creatorId: userId,
			},
		})

	static deleteChosenRecipes = async ({
		recipesId,
		userId,
	}: IDeleteChosenRecipesRequest) =>
		prismaClient.chosenRecipe.deleteMany({
			where: { id: { in: recipesId }, userId },
		})

	static deleteFavoriteRecipes = async ({
		recipesId,
		userId,
	}: IDeleteFavoriteRecipesRequest) =>
		prismaClient.favoriteRecipe.deleteMany({
			where: { id: { in: recipesId }, userId },
		})
}