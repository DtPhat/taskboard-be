```
users/{userId}
  - email
  - verified
  - createdAt

boards/{boardId}
  - name
  - description
  - ownerId
  - members: [userId, ...]
  - createdAt

boards/{boardId}/cards/{cardId}
  - name
  - description
  - createdAt
  - ownerId
  - list_member: [userId, ...]
  - tasks_count

boards/{boardId}/cards/{cardId}/tasks/{taskId}
  - title
  - description
  - status
  - ownerId
  - assignedMembers: [userId, ...]
  - githubAttachments: [{type, number/sha, attachmentId}]

invites/{inviteId}
  - boardId
  - board_owner_id
  - cardId (optional)
  - member_id
  - email_member
  - status (pending, accepted, declined)
  - createdAt
```