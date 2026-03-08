import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const analyticsRouter = Router();

// POST /api/analytics — log an event
analyticsRouter.post('/', async (req, res) => {
    try {
        const { storyId, panelCombination, choicesTaken, endingReached } = req.body;

        const event = await prisma.analyticsEvent.create({
            data: {
                storyId,
                panelCombination,
                choicesTaken: JSON.stringify(choicesTaken || []),
                endingReached: endingReached || null,
            },
        });
        res.json(event);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to log analytics' });
    }
});

// GET /api/analytics/popular/:storyId — get most popular panel combinations
analyticsRouter.get('/popular/:storyId', async (req, res) => {
    try {
        const events = await prisma.analyticsEvent.findMany({
            where: { storyId: req.params.storyId },
            select: { panelCombination: true },
        });

        // Count combinations
        const counts: Record<string, number> = {};
        events.forEach((e) => {
            counts[e.panelCombination] = (counts[e.panelCombination] || 0) + 1;
        });

        const sorted = Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([combination, count]) => ({ combination, count }));

        res.json(sorted);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});
