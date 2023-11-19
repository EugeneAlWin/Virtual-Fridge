import { Router } from 'express'
import RecipeEndpoints from '../api/recipes/endpoints'
import RecipeController from '../controllers/recipeController'
import RecipeDataValidator from '../validators/recipeDataValidator'
import { body } from 'express-validator/src/middlewares/validation-chain-builders'

const recipeRouter = Router()

recipeRouter.get(
	RecipeEndpoints.GET_BY_ID,
	RecipeDataValidator.id(body),
	RecipeController.getRecipeById
)

recipeRouter.get(
	RecipeEndpoints.GET_ALL,
	RecipeDataValidator.title(body),
	RecipeDataValidator.skip(body),
	RecipeDataValidator.take(body),
	RecipeDataValidator.cursor(body),
	RecipeDataValidator.booleanOptional(body, 'isVisible'),
	RecipeDataValidator.booleanOptional(body, 'isApproved'),
	RecipeController.getAllRecipes
)

recipeRouter.get(
	RecipeEndpoints.GET_ALL_CHOSEN,
	RecipeDataValidator.skip(body),
	RecipeDataValidator.take(body),
	RecipeDataValidator.cursor(body),
	RecipeDataValidator.title(body),
	RecipeDataValidator.userId(body),
	RecipeController.getAllChosenRecipes
)

recipeRouter.get(
	RecipeEndpoints.GET_ALL_FAVORITES,
	RecipeDataValidator.skip(body),
	RecipeDataValidator.take(body),
	RecipeDataValidator.cursor(body),
	RecipeDataValidator.title(body),
	RecipeDataValidator.userId(body),
	RecipeController.getAllFavoriteRecipes
)

recipeRouter.post(
	RecipeEndpoints.CREATE,
	RecipeDataValidator.id(body, 'creatorId'),
	RecipeDataValidator.title(body, false, { min: 1, max: 100 }),
	RecipeDataValidator.type(body, false),
	RecipeDataValidator.description(body),
	RecipeDataValidator.booleanOptional(body, 'isVisible'),
	RecipeDataValidator.recipeComposition(body, false),
	RecipeController.createRecipe
)

recipeRouter.post(
	RecipeEndpoints.CREATE_CHOSEN,
	RecipeDataValidator.userId(body),
	RecipeDataValidator.recipeId(body),
	RecipeController.createChosenRecipe
)

recipeRouter.post(
	RecipeEndpoints.CREATE_FAVORITE,
	RecipeDataValidator.userId(body),
	RecipeDataValidator.recipeId(body),
	RecipeController.createFavoriteRecipe
)

recipeRouter.patch(
	RecipeEndpoints.UPDATE,
	RecipeDataValidator.id(body),
	RecipeDataValidator.id(body, 'creatorId'),
	RecipeDataValidator.title(body, true, { min: 1, max: 100 }),
	RecipeDataValidator.type(body, false),
	RecipeDataValidator.description(body),
	RecipeDataValidator.booleanOptional(body, 'isVisible'),
	RecipeDataValidator.booleanOptional(body, 'isApproved'),
	RecipeDataValidator.recipeComposition(body, true),
	RecipeController.updateRecipeData
)

recipeRouter.patch(
	RecipeEndpoints.UPDATE_CHOSEN,
	RecipeDataValidator.userId(body),
	RecipeDataValidator.id(body, 'chosenRecipeId'),
	RecipeDataValidator.booleanOptional(body, 'isCooked'),
	RecipeController.updateChosenRecipe
)

recipeRouter.delete(
	RecipeEndpoints.DELETE,
	RecipeDataValidator.userId(body),
	RecipeDataValidator.recipesId(body),
	RecipeController.deleteRecipes
)

recipeRouter.delete(
	RecipeEndpoints.DELETE_CHOSEN,
	RecipeDataValidator.userId(body),
	RecipeDataValidator.recipesId(body),
	RecipeController.deleteChosenRecipes
)

recipeRouter.delete(
	RecipeEndpoints.DELETE_FAVORITE,
	RecipeDataValidator.userId(body),
	RecipeDataValidator.recipesId(body),
	RecipeController.deleteFavoriteRecipes
)

export default recipeRouter
