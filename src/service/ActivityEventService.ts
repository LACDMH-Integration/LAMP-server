import { Request, Response, Router } from 'express'
import { ActivityEvent } from '../model/ActivityEvent'
import { ActivityEventRepository } from '../repository/ActivityEventRepository'
import { SecurityContext, ActionContext, _verify } from './Security'

const ae2re = (req: Request, e: any) => {
	if (req.path.endsWith('result_event'))
		return e.map((x: any) => ({ ...x, temporal_slices: x.temporal_events, temporal_events: undefined }))
	return e
}
const re2ae = (req: Request, e: any) => {
	if (req.path.endsWith('result_event'))
		return e.map((x: any) => ({ ...x, temporal_events: x.temporal_slices, temporal_slices: undefined }))
	return e
}

export const ActivityEventService = Router()
ActivityEventService.post(['/participant/:participant_id/activity_event', '/participant/:participant_id/result_event'], async (req: Request, res: Response) => {
	try {
		let participant_id = req.params.participant_id
		let activity_event = req.body
		participant_id = await _verify(req, res, ['self', 'sibling', 'parent'], participant_id)
		res.json({ data: await ActivityEventRepository._insert(participant_id, ae2re(req, [activity_event])[0]) })
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
ActivityEventService.delete(['/participant/:participant_id/activity_event', '/participant/:participant_id/result_event'], async (req: Request, res: Response) => {
	try {
		let participant_id = req.params.participant_id
		let origin = req.query.origin
		let from = req.query.from
		let to = req.query.to
		participant_id = await _verify(req, res, ['self', 'sibling', 'parent'], participant_id)
		res.json({ data: await ActivityEventRepository._delete(participant_id, origin, from, to) })
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
ActivityEventService.get(['/participant/:participant_id/activity_event', '/participant/:participant_id/result_event'], async (req: Request, res: Response) => {
	try {
		let participant_id = req.params.participant_id
		let origin = req.query.origin
		let from = req.query.from
		let to = req.query.to
		participant_id = await _verify(req, res, ['self', 'sibling', 'parent'], participant_id)
		res.json({ data: re2ae(req, await ActivityEventRepository._select(participant_id, origin, from, to)) })
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
ActivityEventService.get(['/study/:study_id/activity_event', '/study/:study_id/result_event'], async (req: Request, res: Response) => {
	try {
		let study_id = req.params.study_id
		let origin = req.query.origin
		let from = req.query.from
		let to = req.query.to
		study_id = await _verify(req, res, ['self', 'sibling', 'parent'], study_id)
		res.json({ data: re2ae(req, await ActivityEventRepository._select(study_id, origin, from, to)) })
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
ActivityEventService.get(['/researcher/:researcher_id/activity_event', '/researcher/:researcher_id/result_event'], async (req: Request, res: Response) => {
	try {
		let researcher_id = req.params.researcher_id
		let origin = req.query.origin
		let from = req.query.from
		let to = req.query.to
		researcher_id = await _verify(req, res, ['self', 'sibling', 'parent'], researcher_id)
		res.json({ data: re2ae(req, await ActivityEventRepository._select(researcher_id, origin, from, to)) })
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
