import { Router } from 'express'
import { body, query } from 'express-validator'
import ProductEndpoints from '../api/products/endpoints'
import ProductController from '../controllers/productController'
import ProductDataValidator from '../validators/productDataValidator'

const productRouter = Router()

productRouter.get(
	ProductEndpoints.GET_PRODUCT_BY_ID,
	ProductDataValidator.id(query),
	ProductController.getProductById
)

productRouter.get(
	ProductEndpoints.GET_PRODUCTS_BY_ID,
	ProductDataValidator.ids(query, 'ids'),
	ProductController.getProductsById
)

productRouter.get(
	ProductEndpoints.GET_ALL_PRODUCTS,
	ProductDataValidator.title(query),
	ProductDataValidator.cursor(query),
	ProductDataValidator.skip(query),
	ProductDataValidator.take(query),
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
	ProductDataValidator.productId(body, true),
	ProductDataValidator.productIdArrayEntries(body),
	ProductController.deleteProducts
)

export default productRouter
