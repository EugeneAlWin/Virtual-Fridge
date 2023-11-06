import { body, param, query } from 'express-validator'

export type TLocation = typeof body | typeof param | typeof query
