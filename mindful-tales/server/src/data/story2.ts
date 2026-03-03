// Story 2: The Quiet Garden — Chapters, Scenes, PanelMappings

const S = 'story_2';
const j = JSON.stringify;

export const CHAPTERS_S2 = [
    { id: 's2_ch1', storyId: S, title: 'The Withered Garden', order: 1, entrySceneId: 's2_1' },
    { id: 's2_ch2', storyId: S, title: 'Seeds of Hope', order: 2, entrySceneId: 's2_4' },
    { id: 's2_ch3', storyId: S, title: 'Patience and Rain', order: 3, entrySceneId: 's2_7' },
    { id: 's2_ch4', storyId: S, title: 'Signs of Life', order: 4, entrySceneId: 's2_10' },
    { id: 's2_ch5', storyId: S, title: 'The Bloom', order: 5, entrySceneId: 's2_13' },
    { id: 's2_ch6', storyId: S, title: 'Garden\'s Gift', order: 6, entrySceneId: 's2_16' },
];

export const SCENES_S2 = [
    // Ch1
    {
        id: 's2_1', storyId: S, chapterId: 's2_ch1', speaker: null,
        text: 'Maya pushes open the rusty garden gate. Weeds choke the paths. Dried petals crunch underfoot. It\'s been years since anyone cared for this place.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'worried', position: 'center' }]),
        choices: j([
            { id: 'c2_1a', text: 'Kneel down and start pulling weeds', nextSceneId: 's2_2', setFlags: { startedWork: true } },
            { id: 'c2_1b', text: 'Walk through and observe first', nextSceneId: 's2_3', setFlags: { observedFirst: true } }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's2_2', storyId: S, chapterId: 's2_ch1', speaker: 'maya',
        text: '"Every journey starts with a single step… or a single weed." Maya\'s hands dig into the earth, cool and damp beneath the surface.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's2_4', requireFlags: null
    },

    {
        id: 's2_3', storyId: S, chapterId: 's2_ch1', speaker: null,
        text: 'Maya walks the garden slowly. A dried rose bush. A cracked fountain. A bench with moss. She sees what was — and what could be again.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'neutral', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's2_5', requireFlags: null
    },

    // Ch2
    {
        id: 's2_4', storyId: S, chapterId: 's2_ch2', speaker: null,
        text: 'Maya finds a pouch of seeds in the shed. Some look viable, others crumble to dust. The rain clouds hang low.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'neutral', position: 'center' }]),
        choices: j([
            { id: 'c2_4a', text: 'Plant the seeds right away', nextSceneId: 's2_6', setFlags: { plantedSeeds: true } },
            { id: 'c2_4b', text: 'Wait for the rain to soften the soil', nextSceneId: 's2_7', setFlags: { waitedForRain: true } }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's2_5', storyId: S, chapterId: 's2_ch2', speaker: null,
        text: 'By the lake, Night begins to fall. The garden fades into shadow but Maya can still feel its potential in the cool air.',
        bgKey: 'lake_night', characters: j([{ characterId: 'maya', expression: 'neutral', position: 'left' }, { characterId: 'night_s2', expression: 'neutral', position: 'right' }]),
        choices: j([
            { id: 'c2_5a', text: 'Return tomorrow with tools and seeds', nextSceneId: 's2_4', setFlags: { tookWalk: true } },
            { id: 'c2_5b', text: 'Give up — it\'s too far gone', nextSceneId: 's2_17' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's2_6', storyId: S, chapterId: 's2_ch2', speaker: 'maya',
        text: '"I don\'t know if these will grow, but I know I have to try." She presses each seed into the earth like a tiny prayer.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's2_8', requireFlags: null
    },

    // Ch3
    {
        id: 's2_7', storyId: S, chapterId: 's2_ch3', speaker: null,
        text: 'Rain arrives at dusk. Maya sits on the porch, watching water soak into the garden. Each drop is a tiny act of faith.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'neutral', position: 'center' }]),
        choices: j([
            { id: 'c2_7a', text: 'Plant seeds in the softened earth', nextSceneId: 's2_8', setFlags: { plantedSeeds: true } },
            { id: 'c2_7b', text: 'Walk to the forest path to think', nextSceneId: 's2_9', setFlags: { tookWalk: true } }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's2_8', storyId: S, chapterId: 's2_ch3', speaker: null,
        text: 'The seeds are in the ground. Now comes the hardest part — waiting. Maya visits every morning, checking for the first green thread.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'neutral', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's2_10', requireFlags: null
    },

    {
        id: 's2_9', storyId: S, chapterId: 's2_ch3', speaker: null,
        text: 'The forest path is quiet. Ferns unfurl in the shade. Maya realizes: nature never rushes. Everything grows in its own time.',
        bgKey: 'forest_path', characters: j([{ characterId: 'maya', expression: 'happy', position: 'center' }]),
        choices: j([
            { id: 'c2_9a', text: 'Return to the garden with new resolve', nextSceneId: 's2_10', setFlags: { foundSunlight: true } },
            { id: 'c2_9b', text: 'Stay in the forest — the garden can wait', nextSceneId: 's2_17' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    // Ch4
    {
        id: 's2_10', storyId: S, chapterId: 's2_ch4', speaker: null,
        text: 'A tiny green shoot pushes through the soil. Then another. Maya kneels down, breathless. Life is returning.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'happy', position: 'center' }]),
        choices: j([
            { id: 'c2_10a', text: 'Nurture each sprout carefully', nextSceneId: 's2_11', setFlags: { foundSunlight: true } },
            { id: 'c2_10b', text: 'Let nature take its course', nextSceneId: 's2_12' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's2_11', storyId: S, chapterId: 's2_ch4', speaker: 'maya',
        text: '"Hello, little ones. I\'ve been waiting for you." She waters each plant, talks to them, clears the weeds around their stems.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's2_13', requireFlags: null
    },

    {
        id: 's2_12', storyId: S, chapterId: 's2_ch4', speaker: null,
        text: 'Maya steps back. She trusts the sun, the rain, the earth. Some things don\'t need control — just space to become.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'neutral', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's2_14', requireFlags: null
    },

    // Ch5
    {
        id: 's2_13', storyId: S, chapterId: 's2_ch5', speaker: null,
        text: 'Flowers burst open in a cascade of soft color. Lavender, daisies, wild roses. The garden is alive — really alive.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's2_16', requireFlags: null
    },

    {
        id: 's2_14', storyId: S, chapterId: 's2_ch5', speaker: null,
        text: 'The garden grows wild. Not perfectly, but beautifully. Vines climb the gate. Moss softens the bench. Nature has its own design.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'neutral', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's2_15', requireFlags: null
    },

    {
        id: 's2_15', storyId: S, chapterId: 's2_ch5', speaker: 'maya',
        text: '"I didn\'t restore this garden. I just reminded it that it was allowed to grow." Maya sits on the old bench, surrounded by green.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: 'acceptance', endingTitle: 'Wild Beauty', nextSceneId: null, requireFlags: null
    },

    // Ch6 — Endings
    {
        id: 's2_16', storyId: S, chapterId: 's2_ch6', speaker: null,
        text: 'The garden is magnificent. Butterflies drift between blooms. Maya invites her neighbors. Laughter fills a place that once knew only silence.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: 'bloomed', endingTitle: 'The Garden Blooms', nextSceneId: null, requireFlags: null
    },

    {
        id: 's2_17', storyId: S, chapterId: 's2_ch6', speaker: null,
        text: 'Maya walks away from the garden. The gate swings shut behind her. Maybe someone else will come. Maybe the seeds are still there, waiting.',
        bgKey: 'garden_day', characters: j([{ characterId: 'maya', expression: 'worried', position: 'center' }]),
        choices: j([]), endingType: 'neglect', endingTitle: 'The Abandoned Garden', nextSceneId: null, requireFlags: null
    },

    // SECRET: requires plantedSeeds + tookWalk + foundSunlight
    {
        id: 's2_18', storyId: S, chapterId: 's2_ch6', speaker: 'night_s2',
        text: '"You came back when others wouldn\'t. The garden remembers." Under moonlight, a rare night-blooming flower opens — just for Maya.',
        bgKey: 'lake_night', characters: j([{ characterId: 'night_s2', expression: 'happy', position: 'right' }, { characterId: 'maya', expression: 'happy', position: 'left' }]),
        choices: j([]), endingType: 'secret', endingTitle: 'The Night Bloom', nextSceneId: null,
        requireFlags: j({ plantedSeeds: true, tookWalk: true, foundSunlight: true })
    },
];

export const PANEL_MAPPINGS_S2 = [
    { storyId: S, assetKey: 'maya-seeds-rain_cloud', entrySceneId: 's2_1', initialFlags: j({ hasSeeds: true, hasRain: true }), label: 'Maya plants in the rain' },
    { storyId: S, assetKey: 'maya-seeds-sun', entrySceneId: 's2_1', initialFlags: j({ hasSeeds: true, hasSun: true }), label: 'Maya plants in the sun' },
    { storyId: S, assetKey: 'maya-rain_cloud-sun', entrySceneId: 's2_1', initialFlags: j({ hasRain: true, hasSun: true }), label: 'Maya watches weather change' },
    { storyId: S, assetKey: 'maya-seeds-withered_garden', entrySceneId: 's2_1', initialFlags: j({ hasSeeds: true }), label: 'Maya surveys the withered garden' },
    { storyId: S, assetKey: 'rain_cloud-seeds-sun', entrySceneId: 's2_1', initialFlags: j({ hasRain: true, hasSun: true, hasSeeds: true }), label: 'Perfect conditions' },
];
