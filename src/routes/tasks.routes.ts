import { Router } from 'express';
import TasksController from '../controllers/tasks.controller';

const router = Router({ mergeParams: true });

router.get('/', TasksController.getAllTasks);
router.post('/', TasksController.createTask);
router.get('/:taskId', TasksController.getTaskById);
router.put('/:taskId', TasksController.updateTask);
router.delete('/:taskId', TasksController.deleteTask);

// Task assignment
router.post('/:taskId/assign', TasksController.assignMemberToTask);
router.get('/:taskId/assign', TasksController.getAssignedMembers);
router.delete('/:taskId/assign/:memberId', TasksController.removeMemberAssignment);

// Github attachments
router.post('/:taskId/github-attach', TasksController.attachGithubItem);
router.get('/:taskId/github-attachments', TasksController.getGithubAttachments);
router.delete('/:taskId/github-attachments/:attachmentId', TasksController.removeGithubAttachment);

export default router;