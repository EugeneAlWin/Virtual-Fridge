import { Router } from 'express'
import { body, param } from 'express-validator'
import UserEndpoints from '../api/users/endpoints'
import UserController from '../controllers/userController'
import UserDataValidator from '../validators/userDataValidator'

const userRouter = Router()

userRouter.get(
	UserEndpoints.GET_USER_BY_LOGIN,
	UserDataValidator.login(param),
	UserController.getUserByLogin
)

userRouter.get(
	UserEndpoints.GET_ALL_USERS,
	UserDataValidator.take(body),
	UserDataValidator.skip(body),
	UserDataValidator.login(body, true),
	UserDataValidator.cursor(body),
	UserController.getAllUsers
)

userRouter.get(
	UserEndpoints.GET_USER_TOKENS,
	UserDataValidator.userId(body),
	UserController.getUserTokens
)

userRouter.post(
	UserEndpoints.CREATE_USER,
	UserDataValidator.login(body, false, { max: 30 }),
	UserDataValidator.password(body, false, { max: 120 }),
	UserDataValidator.role(body),
	UserDataValidator.deviceId(body),
	UserDataValidator.refreshToken(body),
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
	UserDataValidator.refreshToken(body),
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
