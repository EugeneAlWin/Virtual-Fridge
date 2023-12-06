import { ProductData } from '../common'

export interface ICreateProductRequest extends Omit<ProductData, 'id'> {}

export interface ICreateProductResponse extends ProductData {}
