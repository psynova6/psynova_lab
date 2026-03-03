// seed.ts — Populate the database with all Mindful Tales content
import { PrismaClient } from '@prisma/client';
import { STORIES, CHARACTERS, BACKGROUNDS } from './data/characters.js';
import { CHAPTERS_S1, SCENES_S1, PANEL_MAPPINGS_S1 } from './data/story1.js';
import { CHAPTERS_S2, SCENES_S2, PANEL_MAPPINGS_S2 } from './data/story2.js';
import { CHAPTERS_S3, SCENES_S3, PANEL_MAPPINGS_S3 } from './data/story3.js';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Mindful Tales database...');

    // Clear existing data
    await prisma.analyticsEvent.deleteMany();
    await prisma.userProgress.deleteMany();
    await prisma.panelMapping.deleteMany();
    await prisma.scene.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.storyBackground.deleteMany();
    await prisma.storyCharacter.deleteMany();
    await prisma.story.deleteMany();

    // Create stories
    for (const story of STORIES) {
        await prisma.story.create({ data: story });
        console.log(`  📖 Created story: ${story.title}`);
    }

    // Create characters
    const allCharacters = [
        ...CHARACTERS.story_1,
        ...CHARACTERS.story_2,
        ...CHARACTERS.story_3,
    ];
    for (const char of allCharacters) {
        await prisma.storyCharacter.create({ data: char });
    }
    console.log(`  🧑 Created ${allCharacters.length} characters`);

    // Create backgrounds
    const allBackgrounds = [
        ...BACKGROUNDS.story_1,
        ...BACKGROUNDS.story_2,
        ...BACKGROUNDS.story_3,
    ];
    for (const bg of allBackgrounds) {
        await prisma.storyBackground.create({ data: bg });
    }
    console.log(`  🖼️  Created ${allBackgrounds.length} backgrounds`);

    // Create chapters
    const allChapters = [...CHAPTERS_S1, ...CHAPTERS_S2, ...CHAPTERS_S3];
    for (const ch of allChapters) {
        await prisma.chapter.create({ data: ch });
    }
    console.log(`  📑 Created ${allChapters.length} chapters`);

    // Create scenes
    const allScenes = [...SCENES_S1, ...SCENES_S2, ...SCENES_S3];
    for (const scene of allScenes) {
        await prisma.scene.create({ data: scene as any });
    }
    console.log(`  🎭 Created ${allScenes.length} scenes`);

    // Create panel mappings
    const allMappings = [...PANEL_MAPPINGS_S1, ...PANEL_MAPPINGS_S2, ...PANEL_MAPPINGS_S3];
    for (const pm of allMappings) {
        await prisma.panelMapping.create({ data: pm });
    }
    console.log(`  🧩 Created ${allMappings.length} panel mappings`);

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
