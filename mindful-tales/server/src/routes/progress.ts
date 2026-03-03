import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const progressRouter = Router();

// GET /api/progress/:userId/:storyId — load progress
progressRouter.get('/:userId/:storyId', async (req, res) => {
    try {
        const progress = await prisma.userProgress.findUnique({
            where: {
                userId_storyId: {
                    userId: req.params.userId,
                    storyId: req.params.storyId,
                },
            },
        });

        if (!progress) {
            res.json(null);
            return;
        }

        res.json({
            ...progress,
            flags: JSON.parse(progress.flags),
            history: JSON.parse(progress.history),
            completedEndings: JSON.parse(progress.completedEndings),
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load progress' });
    }
});

// PUT /api/progress — save progress (upsert)
progressRouter.put('/', async (req, res) => {
    try {
        const { userId, storyId, currentSceneId, flags, history, completedEndings } =
            req.body;

        const progress = await prisma.userProgress.upsert({
            where: {
                userId_storyId: { userId, storyId },
            },
            update: {
                currentSceneId,
                flags: JSON.stringify(flags),
                history: JSON.stringify(history),
                completedEndings: JSON.stringify(completedEndings),
            },
            create: {
                userId,
                storyId,
                currentSceneId,
                flags: JSON.stringify(flags),
                history: JSON.stringify(history),
                completedEndings: JSON.stringify(completedEndings),
            },
        });

        res.json({
            ...progress,
            flags: JSON.parse(progress.flags),
            history: JSON.parse(progress.history),
            completedEndings: JSON.parse(progress.completedEndings),
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

// DELETE /api/progress/:userId/:storyId — reset progress
progressRouter.delete('/:userId/:storyId', async (req, res) => {
    try {
        await prisma.userProgress.delete({
            where: {
                userId_storyId: {
                    userId: req.params.userId,
                    storyId: req.params.storyId,
                },
            },
        });
        res.json({ ok: true });
    } catch (e) {
        // If not found, just say ok
        res.json({ ok: true });
    }
});
