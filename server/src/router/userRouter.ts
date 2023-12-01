import { Router } from 'express'
import { body, cookie, param, query } from 'express-validator'
import UserEndpoints from '../api/users/endpoints'
import UserController from '../controllers/userController'
import authMiddleware from '../middlewares/authMiddleware'
import UserDataValidator from '../validators/userDataValidator'

const userRouter = Router()

userRouter.post(
	UserEndpoints.LOGIN,
	UserDataValidator.login(param, false, { max: 30 }),
	UserDataValidator.password(param, false, { max: 120 }),
	UserDataValidator.deviceId(param),
	UserController.loginUser
)

userRouter.get(
	UserEndpoints.GET_USER_BY_LOGIN,
	UserDataValidator.login(query),
	authMiddleware,
	UserController.getUserByLogin
)

userRouter.get(
	UserEndpoints.GET_ALL_USERS,
	UserDataValidator.take(query),
	UserDataValidator.skip(query),
	UserDataValidator.login(query, true),
	UserDataValidator.cursor(query),
	UserController.getAllUsers
)

userRouter.get(
	UserEndpoints.GET_USER_TOKENS,
	UserDataValidator.userId(query),
	UserController.getUserTokens
)

userRouter.post(
	UserEndpoints.CREATE_USER,
	UserDataValidator.login(body, false, { max: 30 }),
	UserDataValidator.password(body, false, { max: 120 }),
	UserDataValidator.role(body),
	UserController.createUser
)

userRouter.post(
	UserEndpoints.CREATE_USER_TOKEN,
	UserDataValidator.userId(body),
	UserDataValidator.deviceId(body),
	UserDataValidator.refreshToken(body),
	UserController.createUserToken
)

userRouter.patch(
	UserEndpoints.UPDATE_USER_DATA,
	UserDataValidator.userId(body),
	UserDataValidator.login(body, true, { max: 30 }),
	UserDataValidator.password(body, true, { max: 120 }),
	UserDataValidator.isArchived(body),
	UserDataValidator.isBanned(body),
	UserController.updateUserData
)

userRouter.patch(
	UserEndpoints.UPDATE_USER_TOKEN,
	UserDataValidator.userId(body),
	UserDataValidator.deviceId(body),
	UserDataValidator.login(body, false, { max: 30 }),
	UserDataValidator.refreshToken(cookie),
	UserController.updateUserToken
)

userRouter.delete(
	UserEndpoints.DELETE_USERS,
	UserDataValidator.ids(body, 'userIds'),
	UserController.deleteUsers
)

userRouter.delete(
	UserEndpoints.DELETE_USER_TOKENS,
	UserDataValidator.userId(body),
	UserDataValidator.deviceId(body, true),
	UserDataValidator.deviceIdArrayEntries(body),
	UserController.deleteUserTokens
)

export default userRouter
