import { Router } from 'express'
import { body } from 'express-validator'
import ChecklistEndpoints from '../api/checklists/endpoints'
import ChecklistController from '../controllers/checklistController'
import ChecklistDataValidator from '../validators/checklistDataValidator'

const checklistRouter = Router()

checklistRouter.get(
	ChecklistEndpoints.GET_BY_ID,
	ChecklistDataValidator.id(body),
	ChecklistDataValidator.creatorId(body),
	ChecklistController.getChecklistById
)

checklistRouter.get(
	ChecklistEndpoints.GET_ALL,
	ChecklistDataValidator.skip(body),
	ChecklistDataValidator.take(body),
	ChecklistDataValidator.cursor(body),
	ChecklistDataValidator.creatorId(body),
	ChecklistDataValidator.createdAt(body),
	ChecklistController.getAllChecklists
)

checklistRouter.post(
	ChecklistEndpoints.CREATE,
	ChecklistDataValidator.creatorId(body),
	ChecklistDataValidator.ChecklistCompositionArrayEntries(body),
	ChecklistDataValidator.ChecklistPricesEntries(body),
	ChecklistController.createChecklist
)

checklistRouter.patch(
	ChecklistEndpoints.UPDATE,
	ChecklistDataValidator.checklistId(body),
	ChecklistDataValidator.creatorId(body),
	ChecklistDataValidator.isConfirmed(body),
	ChecklistDataValidator.ChecklistCompositionArrayEntries(body),
	ChecklistDataValidator.ChecklistPricesEntries(body),
	ChecklistController.updateChecklist
)

checklistRouter.delete(
	ChecklistEndpoints.DELETE,
	ChecklistDataValidator.creatorId(body),
	ChecklistDataValidator.checklistsIdArray(body),
	ChecklistController.deleteChecklists
)

export default checklistRouter
