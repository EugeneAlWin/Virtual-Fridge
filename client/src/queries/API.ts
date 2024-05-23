import { treaty } from '@elysiajs/eden'
import { VF_API_ROUTER_TYPES } from '@server/index'

export const APIInstance = treaty<VF_API_ROUTER_TYPES>('localhost:3000')
