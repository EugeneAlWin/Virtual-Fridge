import { Router } from 'express'
import { body, query } from 'express-validator'
import ChecklistEndpoints from '../api/checklists/endpoints'
import ChecklistController from '../controllers/checklistController'
import ChecklistDataValidator from '../validators/checklistDataValidator'

const checklistRouter = Router()

checklistRouter.get(
	ChecklistEndpoints.GET_BY_ID,
	ChecklistDataValidator.id(query),
	ChecklistController.getChecklistById
)

checklistRouter.get(
	ChecklistEndpoints.GET_ALL_PREVIEW,
	ChecklistDataValidator.skip(query),
	ChecklistDataValidator.take(query),
	ChecklistDataValidator.cursor(query),
	ChecklistDataValidator.creatorId(query),
	ChecklistDataValidator.createdAt(query),
	ChecklistController.getAllChecklistsPreview
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
