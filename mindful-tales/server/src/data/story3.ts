// Story 3: Bridge Over Troubled Water — Chapters, Scenes, PanelMappings

const S = 'story_3';
const j = JSON.stringify;

export const CHAPTERS_S3 = [
    { id: 's3_ch1', storyId: S, title: 'The Rift', order: 1, entrySceneId: 's3_1' },
    { id: 's3_ch2', storyId: S, title: 'Two Sides', order: 2, entrySceneId: 's3_4' },
    { id: 's3_ch3', storyId: S, title: 'The Meeting Ground', order: 3, entrySceneId: 's3_7' },
    { id: 's3_ch4', storyId: S, title: 'Words Unspoken', order: 4, entrySceneId: 's3_10' },
    { id: 's3_ch5', storyId: S, title: 'Building Bridges', order: 5, entrySceneId: 's3_13' },
    { id: 's3_ch6', storyId: S, title: 'Crossing Over', order: 6, entrySceneId: 's3_16' },
    { id: 's3_ch7', storyId: S, title: 'The Other Side', order: 7, entrySceneId: 's3_19' },
];

export const SCENES_S3 = [
    // Ch1 — The Rift
    {
        id: 's3_1', storyId: S, chapterId: 's3_ch1', speaker: null,
        text: 'The old wooden bridge stretches between two cliffs. Sam stands on one side. Alex — once his closest friend — on the other. Neither moves.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'worried', position: 'left' }, { characterId: 'dracula_s3', expression: 'worried', position: 'right' }]),
        choices: j([
            { id: 'c3_1a', text: 'Sam calls out first', nextSceneId: 's3_2', setFlags: { apologizedFirst: true } },
            { id: 'c3_1b', text: 'Sam turns and walks away', nextSceneId: 's3_3', setFlags: { avoidedCall: true } }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's3_2', storyId: S, chapterId: 's3_ch1', speaker: 'sam',
        text: '"Alex! Wait — I know you can hear me. I know I messed up. Will you just… stand there for a minute? Let me figure out what to say."',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'worried', position: 'left' }, { characterId: 'dracula_s3', expression: 'neutral', position: 'right' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_4', requireFlags: null
    },

    {
        id: 's3_3', storyId: S, chapterId: 's3_ch1', speaker: null,
        text: 'Sam\'s footsteps echo as he walks back into the trees. The bridge sways gently in the wind. Alex watches, then looks down at the river.',
        bgKey: 'forest_path', characters: j([{ characterId: 'sam', expression: 'worried', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_5', requireFlags: null
    },

    // Ch2 — Two Sides
    {
        id: 's3_4', storyId: S, chapterId: 's3_ch2', speaker: null,
        text: 'Professor Chen finds Sam at a desk in the study, scribbling furiously — crossing out words, starting over, crumpling pages.',
        bgKey: 'room_desk', characters: j([{ characterId: 'sam', expression: 'worried', position: 'left' }, { characterId: 'professor_s3', expression: 'neutral', position: 'right' }]),
        choices: j([
            { id: 'c3_4a', text: 'Ask the Professor for advice', nextSceneId: 's3_6', setFlags: { soughtAdvice: true } },
            { id: 'c3_4b', text: 'Keep struggling alone', nextSceneId: 's3_7' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's3_5', storyId: S, chapterId: 's3_ch2', speaker: null,
        text: 'In the forest, Sam sits beneath an old oak. Guilt and pride wrestle inside him. The path back to the bridge is still there.',
        bgKey: 'forest_path', characters: j([{ characterId: 'sam', expression: 'worried', position: 'center' }]),
        choices: j([
            { id: 'c3_5a', text: 'Go back to the bridge tomorrow', nextSceneId: 's3_7', setFlags: {} },
            { id: 'c3_5b', text: 'Convince himself Alex should come first', nextSceneId: 's3_20' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's3_6', storyId: S, chapterId: 's3_ch2', speaker: 'professor_s3',
        text: '"Friendship isn\'t about who was right and who was wrong, Sam. It\'s about who is brave enough to cross the bridge first."',
        bgKey: 'room_desk', characters: j([{ characterId: 'professor_s3', expression: 'happy', position: 'right' }, { characterId: 'sam', expression: 'neutral', position: 'left' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_7', requireFlags: null
    },

    // Ch3 — The Meeting Ground
    {
        id: 's3_7', storyId: S, chapterId: 's3_ch3', speaker: null,
        text: 'Dusk. Sam returns to the bridge. Alex is there — not leaving, not approaching. Just standing. The river sounds like a held breath.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'neutral', position: 'left' }, { characterId: 'dracula_s3', expression: 'neutral', position: 'right' }]),
        choices: j([
            { id: 'c3_7a', text: 'Offer the peace offering', nextSceneId: 's3_8', setFlags: { gavePeaceOffering: true } },
            { id: 'c3_7b', text: 'Start walking across the bridge', nextSceneId: 's3_9', setFlags: { crossedBridge: true } },
            { id: 'c3_7c', text: 'Sit down and wait for Alex to move', nextSceneId: 's3_10' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's3_8', storyId: S, chapterId: 's3_ch3', speaker: 'sam',
        text: 'Sam reaches into his bag and pulls out a worn sketchbook — the one they used to share. He holds it out across the gap. "Remember this?"',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'worried', position: 'left' }, { characterId: 'dracula_s3', expression: 'neutral', position: 'right' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_11', requireFlags: null
    },

    {
        id: 's3_9', storyId: S, chapterId: 's3_ch3', speaker: null,
        text: 'Each plank creaks. Sam takes one step. Then another. The bridge is old but holds. Alex watches, eyes wide — surprised that Sam came first.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'neutral', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_13', requireFlags: null
    },

    // Ch4 — Words Unspoken
    {
        id: 's3_10', storyId: S, chapterId: 's3_ch4', speaker: 'dracula_s3',
        text: '"You\'re really going to just sit there?" Alex\'s voice cracks. "Fine. I\'ll talk first. I was angry because you were right. And I hated that."',
        bgKey: 'city_bridge', characters: j([{ characterId: 'dracula_s3', expression: 'worried', position: 'right' }, { characterId: 'sam', expression: 'neutral', position: 'left' }]),
        choices: j([
            { id: 'c3_10a', text: '"I was right, but I was cruel about it."', nextSceneId: 's3_13', setFlags: { apologizedFirst: true } },
            { id: 'c3_10b', text: '"At least you admit it."', nextSceneId: 's3_12' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's3_11', storyId: S, chapterId: 's3_ch4', speaker: 'dracula_s3',
        text: 'Alex takes the sketchbook with trembling hands. Opens to a page — their first drawing together. A wobbly bridge over a silly river. Both of them laugh.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'dracula_s3', expression: 'happy', position: 'right' }, { characterId: 'sam', expression: 'happy', position: 'left' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_16', requireFlags: null
    },

    {
        id: 's3_12', storyId: S, chapterId: 's3_ch4', speaker: 'dracula_s3',
        text: '"That\'s all you have to say?" Alex\'s face hardens again. "I thought you came to fix this. Not to gloat." The distance between them grows.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'dracula_s3', expression: 'worried', position: 'right' }, { characterId: 'sam', expression: 'worried', position: 'left' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_21', requireFlags: null
    },

    // Ch5 — Building Bridges
    {
        id: 's3_13', storyId: S, chapterId: 's3_ch5', speaker: null,
        text: 'They meet in the middle of the bridge. The planks creak under both their weight. For a long moment, they just look at each other.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'neutral', position: 'left' }, { characterId: 'dracula_s3', expression: 'neutral', position: 'right' }]),
        choices: j([
            { id: 'c3_13a', text: 'Hug without words', nextSceneId: 's3_14', setFlags: { reconciled: true } },
            { id: 'c3_13b', text: 'Shake hands — start over properly', nextSceneId: 's3_15', setFlags: { reconciled: true } }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's3_14', storyId: S, chapterId: 's3_ch5', speaker: null,
        text: 'The hug is awkward at first — too tight, too long, too much pent-up hurt. Then it softens. The wind carries away what words couldn\'t.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'happy', position: 'left' }, { characterId: 'dracula_s3', expression: 'happy', position: 'right' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_16', requireFlags: null
    },

    {
        id: 's3_15', storyId: S, chapterId: 's3_ch5', speaker: 'sam',
        text: '"Hi. I\'m Sam. I\'m terrible at apologizing but great at showing up late." Alex laughs despite himself. "I\'m Alex. I\'m great at holding grudges."',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'happy', position: 'left' }, { characterId: 'dracula_s3', expression: 'happy', position: 'right' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_19', requireFlags: null
    },

    // Ch6 — Crossing Over
    {
        id: 's3_16', storyId: S, chapterId: 's3_ch6', speaker: null,
        text: 'They walk together to the other side of the bridge. The view is different from here — you can see both cliffs, and the river looks like silver thread.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'happy', position: 'left' }, { characterId: 'dracula_s3', expression: 'happy', position: 'right' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's3_19', requireFlags: null
    },

    // Ch7 — Endings
    {
        id: 's3_19', storyId: S, chapterId: 's3_ch7', speaker: null,
        text: 'Side by side, Sam and Alex sit on the cliff watching sunset paint the river gold. Some bonds don\'t break — they stretch, and then hold tighter.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'happy', position: 'left' }, { characterId: 'dracula_s3', expression: 'happy', position: 'right' }]),
        choices: j([]), endingType: 'reconciled', endingTitle: 'Stronger Together', nextSceneId: null, requireFlags: null
    },

    {
        id: 's3_20', storyId: S, chapterId: 's3_ch7', speaker: null,
        text: 'Sam waits. Alex waits. Neither crosses. The bridge rots a little more each year. Sometimes the bravest step is the one never taken — but Sam will never know.',
        bgKey: 'forest_path', characters: j([{ characterId: 'sam', expression: 'worried', position: 'center' }]),
        choices: j([]), endingType: 'regret', endingTitle: 'The Bridge Unwalked', nextSceneId: null, requireFlags: null
    },

    {
        id: 's3_21', storyId: S, chapterId: 's3_ch7', speaker: null,
        text: 'They part ways again. The bridge stands between them, unchanged. Maybe someday. But not today.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'sam', expression: 'worried', position: 'left' }, { characterId: 'dracula_s3', expression: 'worried', position: 'right' }]),
        choices: j([]), endingType: 'distant', endingTitle: 'Parallel Lines', nextSceneId: null, requireFlags: null
    },

    {
        id: 's3_22', storyId: S, chapterId: 's3_ch7', speaker: null,
        text: 'Sam walks home alone but feels lighter. He couldn\'t fix everything, but he tried. Tomorrow he\'ll try again. That\'s enough.',
        bgKey: 'forest_path', characters: j([{ characterId: 'sam', expression: 'neutral', position: 'center' }]),
        choices: j([]), endingType: 'hopeful', endingTitle: 'One Step at a Time', nextSceneId: null, requireFlags: null
    },

    // SECRET: requires apologizedFirst + gavePeaceOffering + crossedBridge
    {
        id: 's3_23', storyId: S, chapterId: 's3_ch7', speaker: 'professor_s3',
        text: '"I saw you both on the bridge today. You know what the remarkable thing is? The bridge didn\'t hold you — you held each other."',
        bgKey: 'room_desk', characters: j([{ characterId: 'professor_s3', expression: 'happy', position: 'center' }, { characterId: 'sam', expression: 'happy', position: 'left' }, { characterId: 'dracula_s3', expression: 'happy', position: 'right' }]),
        choices: j([]), endingType: 'secret', endingTitle: 'The Bridge Builders', nextSceneId: null,
        requireFlags: j({ apologizedFirst: true, gavePeaceOffering: true, crossedBridge: true })
    },
];

export const PANEL_MAPPINGS_S3 = [
    { storyId: S, assetKey: 'alex-bridge-gift-sam', entrySceneId: 's3_1', initialFlags: j({ gavePeaceOffering: true }), label: 'Sam brings a peace offering on the bridge' },
    { storyId: S, assetKey: 'bridge-cliff_edge-sam', entrySceneId: 's3_1', initialFlags: j({}), label: 'Sam at the cliff edge near the bridge' },
    { storyId: S, assetKey: 'alex-bridge-sam', entrySceneId: 's3_1', initialFlags: j({}), label: 'Sam and Alex on the bridge' },
    { storyId: S, assetKey: 'alex-gift-sam', entrySceneId: 's3_1', initialFlags: j({ gavePeaceOffering: true }), label: 'Peace offering between friends' },
    { storyId: S, assetKey: 'bridge-gift-sam', entrySceneId: 's3_1', initialFlags: j({ gavePeaceOffering: true }), label: 'Sam brings a gift to the bridge' },
    { storyId: S, assetKey: 'alex-cliff_edge-sam', entrySceneId: 's3_1', initialFlags: j({ atCliffEdge: true }), label: 'Both friends at the cliff' },
];
