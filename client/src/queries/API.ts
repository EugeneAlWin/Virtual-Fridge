import { treaty } from '@elysiajs/eden'
import { VF_API_ROUTER_TYPES } from '@server/index'
import { STATIC_SERVER_TYPE } from 'server/static'

export const APIInstance = treaty<VF_API_ROUTER_TYPES>('localhost:3000')
export const STATIC_SERVER = treaty<STATIC_SERVER_TYPE>('localhost:3005')
