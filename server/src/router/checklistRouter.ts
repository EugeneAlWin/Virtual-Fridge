import { Router } from 'express'
import ChecklistEndpoints from '../api/checklists/endpoints'
import ChecklistController from '../controllers/checklistController'

const checklistRouter = Router()

checklistRouter.get(
	ChecklistEndpoints.GET_BY_ID,

	ChecklistController.getChecklistById
)

checklistRouter.get(
	ChecklistEndpoints.GET_ALL,

	ChecklistController.getAllChecklists
)

checklistRouter.post(
	ChecklistEndpoints.CREATE,

	ChecklistController.createChecklist
)

checklistRouter.patch(
	ChecklistEndpoints.UPDATE,

	ChecklistController.updateChecklist
)

checklistRouter.delete(
	ChecklistEndpoints.DELETE,

	ChecklistController.deleteChecklists
)

export default checklistRouter
