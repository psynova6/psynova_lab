// Story 1: The Unsent Letter — Chapters, Scenes, PanelMappings

const S = 'story_1';
const j = JSON.stringify;

export const CHAPTERS_S1 = [
    { id: 's1_ch1', storyId: S, title: 'The Discovery', order: 1, entrySceneId: 's1_1' },
    { id: 's1_ch2', storyId: S, title: 'Memories Surface', order: 2, entrySceneId: 's1_4' },
    { id: 's1_ch3', storyId: S, title: 'The Choice', order: 3, entrySceneId: 's1_7' },
    { id: 's1_ch4', storyId: S, title: 'Confronting the Past', order: 4, entrySceneId: 's1_10' },
    { id: 's1_ch5', storyId: S, title: 'Letting Go', order: 5, entrySceneId: 's1_13' },
    { id: 's1_ch6', storyId: S, title: 'New Dawn', order: 6, entrySceneId: 's1_16' },
    { id: 's1_ch7', storyId: S, title: 'The Ending', order: 7, entrySceneId: 's1_19' },
];

export const SCENES_S1 = [
    // Chapter 1 — The Discovery
    {
        id: 's1_1', storyId: S, chapterId: 's1_ch1', speaker: null,
        text: 'Elias sits alone at his old wooden desk. A drawer creaks open, revealing a folded letter — yellowed with time, never sent.',
        bgKey: 'room_desk', characters: j([{ characterId: 'elias', expression: 'neutral', position: 'center' }]),
        choices: j([
            { id: 'c1a', text: 'Read the letter carefully', nextSceneId: 's1_2', setFlags: { readLetter: true } },
            { id: 'c1b', text: 'Put it back and close the drawer', nextSceneId: 's1_3', setFlags: { avoidedLetter: true } }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's1_2', storyId: S, chapterId: 's1_ch1', speaker: 'elias',
        text: '"Dear friend… I never had the courage to say this. You meant more to me than I ever showed." The words blur through quiet tears.',
        bgKey: 'room_desk', characters: j([{ characterId: 'elias', expression: 'worried', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_4', requireFlags: null
    },

    {
        id: 's1_3', storyId: S, chapterId: 's1_ch1', speaker: 'elias',
        text: '"Not today." Elias pushes the drawer shut. But the weight remains — heavier than the wood and the dust.',
        bgKey: 'room_desk', characters: j([{ characterId: 'elias', expression: 'worried', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_5', requireFlags: null
    },

    // Chapter 2 — Memories Surface
    {
        id: 's1_4', storyId: S, chapterId: 's1_ch2', speaker: null,
        text: 'Evening light filters through the library windows. Professor Whitfield notices Elias staring at nothing, lost in thought.',
        bgKey: 'library_evening', characters: j([{ characterId: 'elias', expression: 'worried', position: 'left' }, { characterId: 'professor_s1', expression: 'neutral', position: 'right' }]),
        choices: j([
            { id: 'c4a', text: 'Confide in the Professor', nextSceneId: 's1_6', setFlags: { openedUpToFriend: true } },
            { id: 'c4b', text: 'Deflect and change the subject', nextSceneId: 's1_7', setFlags: { keptSecrets: true } }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's1_5', storyId: S, chapterId: 's1_ch2', speaker: null,
        text: 'Elias walks to the library but sits apart. The Professor waves, but Elias pretends not to see.',
        bgKey: 'library_evening', characters: j([{ characterId: 'elias', expression: 'worried', position: 'left' }, { characterId: 'professor_s1', expression: 'worried', position: 'right' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_7', requireFlags: null
    },

    {
        id: 's1_6', storyId: S, chapterId: 's1_ch2', speaker: 'professor_s1',
        text: '"You\'re carrying something old and heavy, Elias. You don\'t have to carry it alone. Sometimes the bravest thing is letting someone see your scars."',
        bgKey: 'library_evening', characters: j([{ characterId: 'professor_s1', expression: 'happy', position: 'right' }, { characterId: 'elias', expression: 'worried', position: 'left' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_7', requireFlags: null
    },

    // Chapter 3 — The Choice
    {
        id: 's1_7', storyId: S, chapterId: 's1_ch3', speaker: null,
        text: 'Elias stands at the bridge at twilight. The letter is in his pocket. The river flows below, calm and indifferent.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'elias', expression: 'neutral', position: 'center' }]),
        choices: j([
            { id: 'c7a', text: 'Burn the letter at the fireplace', nextSceneId: 's1_8', setFlags: { burnedLetter: true } },
            { id: 'c7b', text: 'Mail the letter', nextSceneId: 's1_9', setFlags: { sentLetter: true } },
            { id: 'c7c', text: 'Read the letter aloud to the wind', nextSceneId: 's1_10', setFlags: { readLetterAloud: true } }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's1_8', storyId: S, chapterId: 's1_ch3', speaker: 'elias',
        text: 'The paper curls and glows in the fireplace. Each word turns to ash and light. "Goodbye," Elias whispers — not to the letter, but to the pain.',
        bgKey: 'room_desk', characters: j([{ characterId: 'elias', expression: 'neutral', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_11', requireFlags: null
    },

    {
        id: 's1_9', storyId: S, chapterId: 's1_ch3', speaker: 'elias',
        text: 'The mailbox clicks shut. The letter is gone — out into the world, carrying truth Elias held too long. His hands tremble, but his shoulders feel lighter.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'elias', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_12', requireFlags: null
    },

    // Chapter 4 — Confronting the Past
    {
        id: 's1_10', storyId: S, chapterId: 's1_ch4', speaker: 'elias',
        text: '"I wrote these words years ago. I was afraid — afraid that saying them would change everything. But silence changed everything instead."',
        bgKey: 'city_bridge', characters: j([{ characterId: 'elias', expression: 'worried', position: 'center' }]),
        choices: j([
            { id: 'c10a', text: 'Forgive yourself', nextSceneId: 's1_13', setFlags: { forgaveSelf: true } },
            { id: 'c10b', text: 'Hold onto the regret', nextSceneId: 's1_14' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's1_11', storyId: S, chapterId: 's1_ch4', speaker: null,
        text: 'The ashes cool. Mina finds Elias by the fireplace and sits beside him quietly. No words needed.',
        bgKey: 'room_desk', characters: j([{ characterId: 'elias', expression: 'neutral', position: 'left' }, { characterId: 'mina_s1', expression: 'neutral', position: 'right' }]),
        choices: j([
            { id: 'c11a', text: 'Tell Mina about the letter', nextSceneId: 's1_13', setFlags: { openedUpToFriend: true, forgaveSelf: true } },
            { id: 'c11b', text: 'Sit in comfortable silence', nextSceneId: 's1_15' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's1_12', storyId: S, chapterId: 's1_ch4', speaker: null,
        text: 'Days pass. The mailbox sits empty. But each morning, Elias feels a little more free — as if the letter carried away not just words, but weight.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'elias', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_16', requireFlags: null
    },

    // Chapter 5 — Letting Go
    {
        id: 's1_13', storyId: S, chapterId: 's1_ch5', speaker: 'elias',
        text: '"I was so busy punishing myself for what I didn\'t say that I forgot to live. Maybe it\'s not too late to start."',
        bgKey: 'library_evening', characters: j([{ characterId: 'elias', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_16', requireFlags: null
    },

    {
        id: 's1_14', storyId: S, chapterId: 's1_ch5', speaker: 'elias',
        text: '"Some things can\'t be fixed. I know that. But knowing doesn\'t stop the ache." Elias walks home in the rain, alone.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'elias', expression: 'worried', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_20', requireFlags: null
    },

    {
        id: 's1_15', storyId: S, chapterId: 's1_ch5', speaker: 'mina_s1',
        text: '"You know, Elias — sometimes silence isn\'t emptiness. It\'s just two people being brave enough to sit with what is." The warmth of the fire is enough.',
        bgKey: 'room_desk', characters: j([{ characterId: 'mina_s1', expression: 'happy', position: 'right' }, { characterId: 'elias', expression: 'neutral', position: 'left' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_18', requireFlags: null
    },

    // Chapter 6 — New Dawn
    {
        id: 's1_16', storyId: S, chapterId: 's1_ch6', speaker: null,
        text: 'A new morning. Sunlight reaches the desk where the letter used to live. Elias opens the drawer and finds it empty — and smiles.',
        bgKey: 'room_desk', characters: j([{ characterId: 'elias', expression: 'happy', position: 'center' }]),
        choices: j([
            { id: 'c16a', text: 'Write a new letter — to yourself', nextSceneId: 's1_19', setFlags: { wroteNewLetter: true } },
            { id: 'c16b', text: 'Close the drawer for good', nextSceneId: 's1_17' }
        ]), endingType: null, endingTitle: null, nextSceneId: null, requireFlags: null
    },

    {
        id: 's1_17', storyId: S, chapterId: 's1_ch6', speaker: 'elias',
        text: '"That chapter is closed." The drawer shuts gently. Elias picks up his coat, steps outside, and breathes.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'elias', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: null, endingTitle: null, nextSceneId: 's1_21', requireFlags: null
    },

    // Chapter 7 — Endings
    {
        id: 's1_18', storyId: S, chapterId: 's1_ch7', speaker: null,
        text: 'Elias and Mina sit by the fire as evening deepens. The letter is ash, the silence is warm, and acceptance fills the room like candlelight.',
        bgKey: 'room_desk', characters: j([{ characterId: 'elias', expression: 'happy', position: 'left' }, { characterId: 'mina_s1', expression: 'happy', position: 'right' }]),
        choices: j([]), endingType: 'acceptance', endingTitle: 'The Warmth of Acceptance', nextSceneId: null, requireFlags: null
    },

    {
        id: 's1_19', storyId: S, chapterId: 's1_ch7', speaker: 'elias',
        text: '"Dear me — I forgive you. For the silence, for the fear, for all the words you swallowed. It\'s time to live unburdened." He seals it. No address needed.',
        bgKey: 'room_desk', characters: j([{ characterId: 'elias', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: 'healed', endingTitle: 'The Letter Home', nextSceneId: null, requireFlags: null
    },

    {
        id: 's1_20', storyId: S, chapterId: 's1_ch7', speaker: null,
        text: 'The letter sits folded on the desk, untouched. Elias goes to bed. Tomorrow will be the same. The weight remains.',
        bgKey: 'room_desk', characters: j([{ characterId: 'elias', expression: 'worried', position: 'center' }]),
        choices: j([]), endingType: 'stuck', endingTitle: 'The Unbroken Silence', nextSceneId: null, requireFlags: null
    },

    {
        id: 's1_21', storyId: S, chapterId: 's1_ch7', speaker: null,
        text: 'On the bridge, the morning air is cool and kind. Elias doesn\'t look back. The past is behind him — not erased, but released. The road ahead is open.',
        bgKey: 'city_bridge', characters: j([{ characterId: 'elias', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: 'hopeful', endingTitle: 'The Open Road', nextSceneId: null, requireFlags: null
    },

    // SECRET ending: requires readLetter + openedUpToFriend + forgaveSelf
    {
        id: 's1_22', storyId: S, chapterId: 's1_ch7', speaker: 'professor_s1',
        text: '"You did something extraordinary, Elias. You looked at your own heart and chose compassion." Professor Whitfield raises his cup. "To new chapters."',
        bgKey: 'library_evening', characters: j([{ characterId: 'professor_s1', expression: 'happy', position: 'right' }, { characterId: 'elias', expression: 'happy', position: 'left' }, { characterId: 'mina_s1', expression: 'happy', position: 'center' }]),
        choices: j([]), endingType: 'secret', endingTitle: 'The Full Circle', nextSceneId: null,
        requireFlags: j({ readLetter: true, openedUpToFriend: true, forgaveSelf: true })
    },
];

export const PANEL_MAPPINGS_S1 = [
    { storyId: S, assetKey: 'desk-elias-letter', entrySceneId: 's1_1', initialFlags: j({ readLetter: true }), label: 'Elias reads the letter at his desk' },
    { storyId: S, assetKey: 'elias-fireplace-letter', entrySceneId: 's1_1', initialFlags: j({ nearFire: true }), label: 'Elias considers burning the letter' },
    { storyId: S, assetKey: 'elias-letter-mailbox', entrySceneId: 's1_1', initialFlags: j({ nearMailbox: true }), label: 'Elias walks to the mailbox' },
    { storyId: S, assetKey: 'desk-elias-fireplace', entrySceneId: 's1_1', initialFlags: j({}), label: 'Elias at the desk near the fireplace' },
    { storyId: S, assetKey: 'elias-fireplace-mailbox', entrySceneId: 's1_1', initialFlags: j({ conflicted: true }), label: 'Elias torn between fire and mail' },
    { storyId: S, assetKey: 'desk-fireplace-letter', entrySceneId: 's1_1', initialFlags: j({}), label: 'The letter rests near the fire' },
];
