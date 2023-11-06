export default class UserEndpoints {
	//Base: /users
	static GET_USER_BY_LOGIN = '/one/:login'
	static GET_ALL_USERS = '/'
	static GET_USER_TOKENS = '/tokens'
	static CREATE_USER = '/create'
	static CREATE_USER_TOKEN = '/tokens/create'
	static UPDATE_USER_DATA = '/update'
	static UPDATE_USER_TOKEN = '/tokens/update'
	static DELETE_USER_TOKENS = '/tokens/delete'
}
