export default class UserEndpoints {
	//Base: /users
	static LOGIN = '/login'
	static GET_USER_BY_LOGIN = '/one/:login'
	static GET_ALL_USERS = '/'
	static GET_USER_TOKENS = '/tokens'
	static CREATE_USER = '/create'
	static CREATE_USER_TOKEN = '/tokens/create'
	static UPDATE_USER_DATA = '/update'
	static UPDATE_USER_TOKEN = '/tokens/update' //map: refresh
	static DELETE_USERS = '/delete'
	static DELETE_USER_TOKENS = '/tokens/delete' //map: logout

	static BASE = '/users'
}
