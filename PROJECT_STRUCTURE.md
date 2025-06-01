```
src/
│
├── app.ts
├── server.ts
├── config/
│   └── index.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── boards.routes.ts
│   ├── cards.routes.ts
│   ├── tasks.routes.ts
│   ├── github.routes.ts
│   └── invite.routes.ts
│
├── controllers/
│   ├── auth.controller.ts
│   ├── boards.controller.ts
│   ├── cards.controller.ts
│   ├── tasks.controller.ts
│   ├── github.controller.ts
│   └── invite.controller.ts
│
├── services/
│   ├── auth.service.ts
│   ├── board.service.ts
│   ├── card.service.ts
│   ├── task.service.ts
│   ├── github.service.ts
│   ├── invite.service.ts
│   └── mail.service.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts
│
├── models/
│   ├── board.model.ts
│   ├── card.model.ts
│   ├── task.model.ts
│   ├── user.model.ts
│   └── invite.model.ts
│
├── utils/
│   ├── jwt.ts
│   └── generateCode.ts
│
├── types/
│   └── express.d.ts
│
└── .env
```