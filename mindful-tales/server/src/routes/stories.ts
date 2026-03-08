import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const storiesRouter = Router();

// GET /api/stories — list all stories
storiesRouter.get('/', async (_req, res) => {
    try {
        const stories = await prisma.story.findMany({
            select: {
                id: true,
                title: true,
                theme: true,
                goal: true,
                panelCount: true,
                initialPrompt: true,
            },
        });
        res.json(stories);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

// GET /api/stories/:id — full story with all relations
storiesRouter.get('/:id', async (req, res) => {
    try {
        const story = await prisma.story.findUnique({
            where: { id: req.params.id },
            include: {
                chapters: { orderBy: { order: 'asc' } },
                scenes: true,
                characters: true,
                backgrounds: true,
                panelMappings: true,
            },
        });

        if (!story) {
            res.status(404).json({ error: 'Story not found' });
            return;
        }

        // Parse JSON fields in scenes
        const parsedScenes = story.scenes.map((scene) => ({
            ...scene,
            characters: JSON.parse(scene.characters),
            choices: JSON.parse(scene.choices),
            requireFlags: scene.requireFlags ? JSON.parse(scene.requireFlags) : undefined,
        }));

        // Parse JSON fields in panelMappings
        const parsedMappings = story.panelMappings.map((pm) => ({
            ...pm,
            initialFlags: pm.initialFlags ? JSON.parse(pm.initialFlags) : undefined,
        }));

        res.json({
            ...story,
            scenes: parsedScenes,
            panelMappings: parsedMappings,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch story' });
    }
});

// GET /api/stories/:id/scene/:sceneId — single scene
storiesRouter.get('/:id/scene/:sceneId', async (req, res) => {
    try {
        const scene = await prisma.scene.findUnique({
            where: { id: req.params.sceneId },
        });

        if (!scene || scene.storyId !== req.params.id) {
            res.status(404).json({ error: 'Scene not found' });
            return;
        }

        res.json({
            ...scene,
            characters: JSON.parse(scene.characters),
            choices: JSON.parse(scene.choices),
            requireFlags: scene.requireFlags ? JSON.parse(scene.requireFlags) : undefined,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch scene' });
    }
});
