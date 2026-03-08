// puzzleData2.ts — Stories 6-10
import type { PuzzleChapter } from '../types';
import { C, B, T, n } from './sharedData';

// CH6: Echoes in the Hallway
export const CH6: PuzzleChapter = {
    id: 'ch6', title: 'Echoes in the Hallway', theme: 'Social Anxiety', panelCount: 3,
    goal: 'Help Leo walk through the hallway without freezing.',
    blurb: 'The school hallway echoes with laughter. For Leo, each step is a mountain. But he doesn\'t have to walk alone.',
    characters: [C.leo, C.kiran, C.theo], tokens: [T.phone],
    backgrounds: [B.hallway, B.classroom, B.garden],
    hint: 'Leo needs a friend beside him, not behind...', defaultOutcomeId: 'c6_def', allowStacking: true,
    combinations: [
        { key: 'leo+kiran:hallway|theo:classroom|kiran:garden', outcomeId: 'c6_brave' },
        { key: 'kiran:hallway|leo:classroom|theo:garden', outcomeId: 'c6_avoid' },
        { key: 'theo:hallway|leo+kiran:classroom|kiran:garden', outcomeId: 'c6_shield' },
        { key: 'leo+phone:hallway|kiran:classroom|theo:garden', outcomeId: 'c6_distract' },
    ],
    outcomes: [
        {
            id: 'c6_brave', type: 'success', title: 'Walking Together', badge: '👫', goalMet: true,
            feedback: 'With Kiran joking beside him, Leo made it through!',
            panelNarrations: [
                n("Leo and Kiran walk side by side. Kiran cracks a joke.", 'happy', 'sparkle', 'Kiran'),
                n("Theo watches from the classroom, proud. \"He's doing it.\"", 'happy', 'hearts', 'Theo'),
                n("The hallway doesn't feel so long anymore.", 'happy', 'sparkle'),
            ]
        },
        {
            id: 'c6_avoid', type: 'failure', title: 'The Detour', badge: '🔄', goalMet: false,
            feedback: 'Leo avoided the hallway entirely. Avoidance isn\'t healing.',
            panelNarrations: [
                n("Kiran walks the hallway alone, confused.", 'worried', 'question', 'Kiran'),
                n("Leo hides in the classroom. \"I just can't.\"", 'worried', 'wisps', 'Leo'),
                n("Theo finds Leo outside. \"Tomorrow we try again, together.\"", 'neutral', 'hearts', 'Theo'),
            ]
        },
        {
            id: 'c6_shield', type: 'partial', title: 'The Shield', badge: '🛡️', goalMet: false,
            feedback: 'Theo protected Leo, but Leo needs to face it himself.',
            panelNarrations: [
                n("Theo stands guard in the hallway. \"Nobody mess with my friend.\"", 'neutral', 'exclamation', 'Theo'),
                n("Leo and Kiran sit safely in class. Kiran: \"You okay?\"", 'neutral', 'none', 'Kiran'),
                n("Leo nods. \"But I need to do it myself someday.\"", 'worried', 'none', 'Leo'),
            ]
        },
        {
            id: 'c6_distract', type: 'partial', title: 'Screen Shield', badge: '📱', goalMet: false,
            feedback: 'The phone distracted Leo, but he didn\'t really face his fear.',
            panelNarrations: [
                n("Leo stares at his phone, walking blindly through the hallway.", 'neutral', 'none', 'Leo'),
                n("Kiran waves from the classroom. \"Did you even notice me?\"", 'worried', 'question', 'Kiran'),
                n("Theo sighs. \"Distraction isn't the same as courage.\"", 'neutral', 'none', 'Theo'),
            ]
        },
        {
            id: 'c6_def', type: 'failure', title: 'Frozen', badge: '🧊', goalMet: false,
            feedback: 'Leo froze. He needs a friend right beside him.',
            panelNarrations: [
                n("Leo stands at the hallway entrance, unable to move.", 'worried', 'wisps'),
                n("\"I can hear everyone laughing...\"", 'worried', 'wisps', 'Leo'),
                n("The bell rings. Another chance tomorrow.", 'neutral', 'none'),
            ]
        },
    ],
};

// CH7: The Garden of Second Chances
export const CH7: PuzzleChapter = {
    id: 'ch7', title: 'The Garden of Second Chances', theme: 'Forgiveness', panelCount: 3,
    goal: 'Help two people forgive and start fresh.',
    blurb: 'A withered garden between two houses. Once shared, now neglected. Can it bloom again with forgiveness?',
    characters: [C.elias, C.iris, C.rowan], tokens: [T.letter, T.flower],
    backgrounds: [B.garden, B.house, B.bridge],
    hint: 'Sometimes you need to write what you can\'t say...', defaultOutcomeId: 'c7_def', allowStacking: true,
    combinations: [
        { key: 'elias+letter:house|iris:bridge|rowan+flower:garden', outcomeId: 'c7_forgive' },
        { key: 'iris:house|elias:garden|rowan:bridge', outcomeId: 'c7_distance' },
        { key: 'rowan:house|elias+flower:bridge|iris:garden', outcomeId: 'c7_gesture' },
        { key: 'elias+iris:garden|rowan+letter:house|iris:bridge', outcomeId: 'c7_together' },
    ],
    outcomes: [
        {
            id: 'c7_forgive', type: 'success', title: 'Words Unspoken, Finally Said', badge: '💌', goalMet: true,
            feedback: 'The letter said what Elias couldn\'t. The garden bloomed between them.',
            panelNarrations: [
                n("Elias writes the letter he's held inside for months.", 'worried', 'sparkle', 'Elias'),
                n("Iris crosses the bridge, heart racing, letter in hand.", 'worried', 'none', 'Iris'),
                n("Rowan plants the first flower. The garden remembers.", 'happy', 'hearts', 'Rowan'),
            ]
        },
        {
            id: 'c7_distance', type: 'failure', title: 'Still Apart', badge: '💔', goalMet: false,
            feedback: 'They stayed in separate places. Forgiveness requires a step forward.',
            panelNarrations: [
                n("Iris sits alone in the empty house.", 'worried', 'wisps', 'Iris'),
                n("Elias tends the garden alone, thinking.", 'worried', 'none', 'Elias'),
                n("Rowan stands on the bridge, wishing they'd meet.", 'worried', 'question', 'Rowan'),
            ]
        },
        {
            id: 'c7_gesture', type: 'partial', title: 'A Small Gesture', badge: '🌷', goalMet: false,
            feedback: 'The flower was beautiful, but Elias needs words too.',
            panelNarrations: [
                n("Rowan prepares the house for a visitor.", 'neutral', 'none', 'Rowan'),
                n("Elias offers a flower on the bridge. Iris sees it.", 'neutral', 'sparkle', 'Elias'),
                n("Iris takes the flower but looks away. \"I need more than this.\"", 'worried', 'none', 'Iris'),
            ]
        },
        {
            id: 'c7_together', type: 'secret', title: '🌈 Starting Over', badge: '🔮', goalMet: true,
            feedback: 'Secret! They planted the garden together, side by side. That was the apology.',
            panelNarrations: [
                n("Elias and Iris kneel in the garden soil, together. No words needed.", 'happy', 'hearts'),
                n("Rowan writes the whole story in a letter to keep.", 'happy', 'sparkle', 'Rowan'),
                n("The garden between them bursts with color.", 'happy', 'stars'),
            ]
        },
        {
            id: 'c7_def', type: 'failure', title: 'Unfinished', badge: '❓', goalMet: false,
            feedback: 'The garden stays empty. Someone needs to take the first step.',
            panelNarrations: [
                n("No one moves. The silence grows.", 'neutral', 'wisps'),
                n("\"I wish I could say something...\"", 'worried', 'none'),
                n("Maybe next spring.", 'neutral', 'none'),
            ]
        },
    ],
};

// CH8: The Silent Storm
export const CH8: PuzzleChapter = {
    id: 'ch8', title: 'The Silent Storm', theme: 'Anger', panelCount: 3,
    goal: 'Help someone express anger without destruction.',
    blurb: 'Thunder builds inside. Kiran smiles, but a storm rages beneath. How do you let it out without breaking things?',
    characters: [C.kiran, C.asha, C.maya], tokens: [T.book],
    backgrounds: [B.cliff, B.meadow, B.lake],
    hint: 'Anger needs a safe place to land...', defaultOutcomeId: 'c8_def', allowStacking: true,
    combinations: [
        { key: 'kiran:cliff|asha:meadow|maya:lake', outcomeId: 'c8_release' },
        { key: 'kiran:lake|maya:cliff|asha:meadow', outcomeId: 'c8_drown' },
        { key: 'asha:cliff|kiran+book:meadow|maya:lake', outcomeId: 'c8_journal' },
        { key: 'kiran+asha:cliff|maya:meadow|asha:lake', outcomeId: 'c8_held' },
    ],
    outcomes: [
        {
            id: 'c8_release', type: 'success', title: 'Scream at the Sky', badge: '⚡', goalMet: true,
            feedback: 'Kiran screamed from the clifftop into the wind. The storm passed.',
            panelNarrations: [
                n("Kiran stands at the cliff edge and SCREAMS. The wind carries it away.", 'worried', 'exclamation', 'Kiran'),
                n("Asha sits in the meadow, listening from afar. \"Good. Let it out.\"", 'neutral', 'sparkle', 'Asha'),
                n("Maya watches the lake ripple. \"The water feels calmer now.\"", 'happy', 'sparkle', 'Maya'),
            ]
        },
        {
            id: 'c8_drown', type: 'failure', title: 'Swallowed Whole', badge: '🌊', goalMet: false,
            feedback: 'Kiran tried to bury it in the lake. Anger doesn\'t dissolve in water.',
            panelNarrations: [
                n("Kiran stares into the lake, pushing feelings down.", 'worried', 'wisps', 'Kiran'),
                n("Maya feels the tension from the cliff. \"Something's wrong.\"", 'worried', 'question', 'Maya'),
                n("Asha reaches out from the meadow, too far.", 'worried', 'none', 'Asha'),
            ]
        },
        {
            id: 'c8_journal', type: 'partial', title: 'Written Thunder', badge: '📝', goalMet: false,
            feedback: 'Writing helped! But Kiran needs to speak the words too.',
            panelNarrations: [
                n("Asha guides from the clifftop. \"Write what you can't say.\"", 'neutral', 'sparkle', 'Asha'),
                n("Kiran writes furiously in the journal. Tears blur the ink.", 'worried', 'none', 'Kiran'),
                n("Maya reads the pages later. \"I had no idea you felt this way.\"", 'worried', 'hearts', 'Maya'),
            ]
        },
        {
            id: 'c8_held', type: 'secret', title: '🫂 Held Through the Storm', badge: '🔮', goalMet: true,
            feedback: 'Secret! Asha simply sat with Kiran on the cliff. Presence was enough.',
            panelNarrations: [
                n("Asha sits beside Kiran on the cliff. No words. Just presence.", 'neutral', 'hearts', 'Asha'),
                n("Maya watches from the meadow as the sun breaks through clouds.", 'happy', 'stars', 'Maya'),
                n("Kiran finally cries. \"Thank you for staying.\"", 'happy', 'hearts', 'Kiran'),
            ]
        },
        {
            id: 'c8_def', type: 'failure', title: 'Bottled Up', badge: '🫙', goalMet: false,
            feedback: 'The storm is still raging inside. Kiran needs someone close by.',
            panelNarrations: [
                n("Kiran smiles, but the smile doesn't reach the eyes.", 'neutral', 'wisps'),
                n("\"I'm fine,\" Kiran lies.", 'neutral', 'none', 'Kiran'),
                n("The clouds grow darker.", 'worried', 'wisps'),
            ]
        },
    ],
};

// CH9: The Starry Walk
export const CH9: PuzzleChapter = {
    id: 'ch9', title: 'The Starry Walk', theme: 'Sleep', panelCount: 3,
    goal: 'Help the overthinker find rest under the stars.',
    blurb: 'Luna can\'t sleep. Her mind races with a thousand thoughts. A gentle walk under stars might quiet the noise.',
    characters: [C.luna, C.night, C.asha], tokens: [T.blanket, T.star],
    backgrounds: [B.nightSky, B.meadow, B.lake],
    hint: 'Night brings rest, but only with the right company...', defaultOutcomeId: 'c9_def', allowStacking: true,
    combinations: [
        { key: 'luna:meadow|night:nightSky|asha+blanket:lake', outcomeId: 'c9_rest' },
        { key: 'luna:nightSky|night:lake|asha:meadow', outcomeId: 'c9_racing' },
        { key: 'asha:nightSky|luna+blanket:meadow|night:lake', outcomeId: 'c9_cocoon' },
        { key: 'night+star:nightSky|luna:lake|asha:meadow', outcomeId: 'c9_lullaby' },
    ],
    outcomes: [
        {
            id: 'c9_rest', type: 'success', title: 'Peaceful Rest', badge: '😴', goalMet: true,
            feedback: 'Luna walked until her thoughts softened, then found rest by the lake.',
            panelNarrations: [
                n("Luna walks through the meadow, counting each step.", 'neutral', 'none', 'Luna'),
                n("Night unfolds gently overhead. Stars appear one by one.", 'neutral', 'stars', 'Night'),
                n("Asha wraps the blanket around Luna by the lake. \"Sleep now.\"", 'happy', 'hearts', 'Asha'),
            ]
        },
        {
            id: 'c9_racing', type: 'failure', title: 'Racing Thoughts', badge: '💭', goalMet: false,
            feedback: 'Looking at all the stars made Luna think more, not less.',
            panelNarrations: [
                n("Luna stares at the infinite sky. Each star is a worry.", 'worried', 'wisps', 'Luna'),
                n("Night shimmers on the lake, too beautiful to ignore.", 'neutral', 'stars'),
                n("Asha's voice is too far. \"Come back to the ground...\"", 'worried', 'none', 'Asha'),
            ]
        },
        {
            id: 'c9_cocoon', type: 'partial', title: 'The Cocoon', badge: '🧣', goalMet: false,
            feedback: 'Luna felt safe, but she\'s hiding, not resting. Rest needs surrender.',
            panelNarrations: [
                n("Asha watches the sky, looking for a lullaby in the stars.", 'neutral', 'stars', 'Asha'),
                n("Luna curls under the blanket in the meadow. Safe but awake.", 'worried', 'none', 'Luna'),
                n("Night reflects off the lake. \"You can't hide from dreams.\"", 'neutral', 'wisps', 'Night'),
            ]
        },
        {
            id: 'c9_lullaby', type: 'secret', title: '🌙 Night\'s Lullaby', badge: '🔮', goalMet: true,
            feedback: 'Secret! Night sang a lullaby made of starlight, and Luna finally slept.',
            panelNarrations: [
                n("Night weaves a special star into the sky. It hums softly.", 'happy', 'stars', 'Night'),
                n("Luna hears the melody from the lake. Her eyes grow heavy.", 'happy', 'sparkle', 'Luna'),
                n("Asha whispers from the meadow. \"Even the stars sleep sometimes.\"", 'happy', 'hearts', 'Asha'),
            ]
        },
        {
            id: 'c9_def', type: 'failure', title: 'Wide Awake', badge: '👀', goalMet: false,
            feedback: 'Luna lies awake. She needs gentle company, not solitude.',
            panelNarrations: [
                n("Luna tosses and turns.", 'worried', 'wisps'),
                n("\"Why can't I just stop thinking?\"", 'worried', 'none', 'Luna'),
                n("The night stretches on endlessly.", 'neutral', 'wisps'),
            ]
        },
    ],
};

// CH10: The Mirror Room
export const CH10: PuzzleChapter = {
    id: 'ch10', title: 'The Mirror Room', theme: 'Self-Acceptance', panelCount: 3,
    goal: 'Help someone see themselves with kindness.',
    blurb: 'A room full of mirrors, each showing a different face. Iris doesn\'t like what she sees. Can she learn to?',
    characters: [C.iris, C.mina, C.theo], tokens: [T.book, T.flower],
    backgrounds: [B.mirror, B.garden, B.study],
    hint: 'Sometimes you need a friend to show you what they see...', defaultOutcomeId: 'c10_def', allowStacking: true,
    combinations: [
        { key: 'iris:mirror|mina+flower:garden|theo:study', outcomeId: 'c10_accept' },
        { key: 'iris:study|mina:mirror|theo:garden', outcomeId: 'c10_hide' },
        { key: 'mina:mirror|iris+book:study|theo:garden', outcomeId: 'c10_story' },
        { key: 'iris+mina:mirror|theo+flower:garden|mina:study', outcomeId: 'c10_together' },
    ],
    outcomes: [
        {
            id: 'c10_accept', type: 'success', title: 'Seeing Clearly', badge: '🪞', goalMet: true,
            feedback: 'Iris looked in the mirror and, for the first time, smiled at herself.',
            panelNarrations: [
                n("Iris faces the mirror. \"Who is that?\" The reflection softens.", 'worried', 'sparkle', 'Iris'),
                n("Mina places a flower in the garden. \"This is how I see you: beautiful.\"", 'happy', 'hearts', 'Mina'),
                n("Theo reads from the study. \"You've always been enough.\"", 'happy', 'sparkle', 'Theo'),
            ]
        },
        {
            id: 'c10_hide', type: 'failure', title: 'Behind the Books', badge: '📚', goalMet: false,
            feedback: 'Iris hid in the study. You can\'t accept yourself if you don\'t look.',
            panelNarrations: [
                n("Iris buries herself in books. \"I'm fine in here.\"", 'neutral', 'none', 'Iris'),
                n("Mina stands before the mirror. \"Iris, come look!\"", 'happy', 'question', 'Mina'),
                n("Theo tends the garden, quiet. \"She'll come when she's ready.\"", 'neutral', 'none', 'Theo'),
            ]
        },
        {
            id: 'c10_story', type: 'partial', title: 'Someone Else\'s Story', badge: '📖', goalMet: false,
            feedback: 'Iris wrote about a character who loved herself. Now she needs to be that character.',
            panelNarrations: [
                n("Mina looks in the mirror. \"I wish Iris could see what I see.\"", 'worried', 'hearts', 'Mina'),
                n("Iris writes a story about a brave girl. \"She's... me?\"", 'neutral', 'sparkle', 'Iris'),
                n("Theo smiles from the garden. \"Close. Now live it.\"", 'happy', 'none', 'Theo'),
            ]
        },
        {
            id: 'c10_together', type: 'secret', title: '💕 Mirror, Mirror', badge: '🔮', goalMet: true,
            feedback: 'Secret! Iris and Mina stood before the mirror together. Mina described what she saw, and Iris finally believed it.',
            panelNarrations: [
                n("Iris and Mina stand before the mirror. \"Tell me what you see.\"", 'worried', 'sparkle', 'Iris'),
                n("Theo places flowers around the garden. \"You're both wonderful.\"", 'happy', 'hearts', 'Theo'),
                n("Iris looks again. \"Oh... I see it now.\" She smiles.", 'happy', 'stars', 'Iris'),
            ]
        },
        {
            id: 'c10_def', type: 'failure', title: 'Shattered', badge: '💔', goalMet: false,
            feedback: 'The mirrors feel unkind. Iris needs a friend to stand beside her.',
            panelNarrations: [
                n("The mirrors reflect a hundred versions of doubt.", 'worried', 'wisps'),
                n("\"I don't want to look.\"", 'worried', 'none', 'Iris'),
                n("The room grows cold.", 'neutral', 'wisps'),
            ]
        },
    ],
};
