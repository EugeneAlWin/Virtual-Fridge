import { Router } from 'express'
import ProductEndpoints from '../api/products/endpoints'
import ProductController from '../controllers/productController'
import ProductDataValidator from '../validators/productDataValidator'
import { body, param } from 'express-validator'

const productRouter = Router()

productRouter.get(
	ProductEndpoints.GET_PRODUCT_BY_ID,
	ProductDataValidator.id(param),
	ProductController.getProductById
)

productRouter.get(
	ProductEndpoints.GET_ALL_PRODUCTS,
	ProductDataValidator.title(body),
	ProductDataValidator.cursor(body),
	ProductDataValidator.skip(body),
	ProductDataValidator.take(body),
	ProductController.getAllProducts
)

productRouter.post(
	ProductEndpoints.CREATE_PRODUCT,
	ProductDataValidator.title(body, false, { max: 50 }),
	ProductDataValidator.calories(body),
	ProductDataValidator.protein(body),
	ProductDataValidator.fats(body),
	ProductDataValidator.carbohydrates(body),
	ProductDataValidator.creatorId(body),
	ProductController.createProduct
)

productRouter.patch(
	ProductEndpoints.UPDATE_PRODUCT,
	ProductDataValidator.id(body),
	ProductDataValidator.title(body, true, { max: 50 }),
	ProductDataValidator.calories(body, true),
	ProductDataValidator.protein(body, true),
	ProductDataValidator.fats(body, true),
	ProductDataValidator.carbohydrates(body, true),
	ProductController.updateProductData
)

productRouter.delete(
	ProductEndpoints.DELETE_PRODUCT,
	ProductDataValidator.creatorId(body),
	ProductDataValidator.productId(body, true),
	ProductDataValidator.productIdArrayEntries(body),
	ProductController.deleteProducts
)

export default productRouter
