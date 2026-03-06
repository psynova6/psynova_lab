// ============================================================
// puzzleData.ts — 10 mindful puzzle chapters (Part 1: setup + stories 1-5)
// ============================================================
import type { PuzzleChapter } from '../types';
import { C, B, T, n } from './sharedData';

// ════════════════════════════════════════════════════
// CHAPTER 1: The Castle Mystery (existing, refined)
// ════════════════════════════════════════════════════
const CH1: PuzzleChapter = {
    id: 'ch1', title: 'The Castle Mystery', theme: 'Courage', panelCount: 3,
    goal: 'Rescue the friend trapped in the castle.',
    blurb: 'An ancient castle hides a trapped friend. Only the right heroes, in the right order, can open its gates.',
    characters: [C.elias, C.mina, C.dracula], tokens: [],
    backgrounds: [B.castle, B.crypt, B.garden],
    hint: 'Who should approach the castle first?', defaultOutcomeId: 'c1_def', allowStacking: false,
    combinations: [
        { key: 'elias:castle|mina:garden|dracula:crypt', outcomeId: 'c1_rescue' },
        { key: 'dracula:castle|elias:crypt|mina:garden', outcomeId: 'c1_ambush' },
        { key: 'mina:castle|dracula:garden|elias:crypt', outcomeId: 'c1_alliance' },
        { key: 'dracula:garden|mina:crypt|elias:castle', outcomeId: 'c1_secret' },
        { key: 'elias:garden|mina:castle|dracula:crypt', outcomeId: 'c1_discovery' },
    ],
    outcomes: [
        {
            id: 'c1_rescue', type: 'success', title: 'The Brave Rescue', badge: '✨', goalMet: true,
            feedback: "Elias's courage opened the castle doors!",
            panelNarrations: [
                n("Elias approaches the castle gates. His heart pounds, but he pushes forward.", 'worried', 'none', 'Narrator'),
                n("\"Don't worry! I'll keep the garden path open!\" calls Mina.", 'happy', 'sparkle', 'Mina'),
                n("Dracula sighs in the crypt. \"I suppose I'll guard this passage... for a friend.\"", 'neutral', 'hearts', 'Dracula'),
            ]
        },
        {
            id: 'c1_ambush', type: 'failure', title: 'The Ambush!', badge: '💔', goalMet: false,
            feedback: 'Dracula in the castle first scared everyone away!',
            panelNarrations: [
                n("Dracula swoops into the castle dramatically. Torches flicker.", 'happy', 'exclamation'),
                n("Elias stumbles through the dark crypt. \"Hello? Anyone?\"", 'worried', 'question', 'Elias'),
                n("Mina waits in the garden. \"Something doesn't feel right...\"", 'worried', 'none', 'Mina'),
            ]
        },
        {
            id: 'c1_alliance', type: 'partial', title: 'An Unlikely Alliance', badge: '⚡', goalMet: false,
            feedback: 'Mina befriended Dracula, but the rescue is incomplete.',
            panelNarrations: [
                n("Mina enters the castle fearlessly. \"There must be a reason you're here.\"", 'neutral', 'sparkle', 'Mina'),
                n("Dracula tends the rose garden. \"These are... quite lovely.\"", 'happy', 'hearts', 'Dracula'),
                n("Elias finds old journals in the crypt. \"A whole history!\"", 'happy', 'exclamation', 'Elias'),
            ]
        },
        {
            id: 'c1_secret', type: 'secret', title: '🌙 Dracula\'s Redemption', badge: '🔮', goalMet: true,
            feedback: 'Secret ending! Dracula found peace in the garden sunlight.',
            panelNarrations: [
                n("Dracula steps into the sunlit garden. The warmth... heals.", 'worried', 'sparkle'),
                n("Mina discovers Dracula's diary in the crypt. \"He just wanted to be understood...\"", 'worried', 'hearts', 'Mina'),
                n("Elias finds the castle empty and peaceful. A note: \"Thank you for believing.\"", 'happy', 'sparkle'),
            ]
        },
        {
            id: 'c1_discovery', type: 'partial', title: 'Hidden Discovery', badge: '🔍', goalMet: false,
            feedback: 'You found clues, but the rescue needs a braver approach.',
            panelNarrations: [
                n("Elias wanders the garden and finds a secret trail.", 'neutral', 'question'),
                n("Mina searches the castle library. \"A hidden passage!\"", 'happy', 'sparkle', 'Mina'),
                n("Dracula guards the crypt, yawning.", 'neutral', 'none', 'Dracula'),
            ]
        },
        {
            id: 'c1_def', type: 'failure', title: 'A Muddled Tale', badge: '❓', goalMet: false,
            feedback: "This arrangement doesn't tell a clear story. Think about where each character belongs.",
            panelNarrations: [
                n("The characters look around, confused.", 'worried', 'question'),
                n("\"I don't think this is right...\" someone murmurs.", 'worried', 'none'),
                n("The story fizzles. Perhaps a different arrangement?", 'neutral', 'question'),
            ]
        },
    ],
};

// ════════════════════════════════════════════════════
// CHAPTER 2: The Quiet Garden (existing, refined)
// ════════════════════════════════════════════════════
const CH2: PuzzleChapter = {
    id: 'ch2', title: 'The Quiet Garden', theme: 'Growth', panelCount: 3,
    goal: 'Restore the garden to full bloom.',
    blurb: 'A once-vibrant garden lies withered. Only the right care, in the right order, can bring it back.',
    characters: [C.maya, C.sam, C.professor], tokens: [T.flower],
    backgrounds: [B.garden, B.forest, B.house],
    hint: 'Who has the greenest thumb?', defaultOutcomeId: 'c2_def', allowStacking: true,
    combinations: [
        { key: 'maya:garden|sam:forest|professor:house', outcomeId: 'c2_bloom' },
        { key: 'professor:garden|maya:house|sam:forest', outcomeId: 'c2_study' },
        { key: 'sam:garden|maya:forest|professor:house', outcomeId: 'c2_wild' },
        { key: 'maya+flower:garden|sam:forest|professor:house', outcomeId: 'c2_miracle' },
    ],
    outcomes: [
        {
            id: 'c2_bloom', type: 'success', title: 'Full Bloom!', badge: '🌸', goalMet: true,
            feedback: "Maya's love brought the garden back!",
            panelNarrations: [
                n("Maya kneels in the soil, whispering to the seeds.", 'happy', 'sparkle', 'Narrator'),
                n("Sam finds rare wildflowers in the forest to transplant.", 'happy', 'hearts', 'Sam'),
                n("The Professor documents the growth from his window.", 'happy', 'sparkle', 'Professor'),
            ]
        },
        {
            id: 'c2_study', type: 'partial', title: 'Academic Approach', badge: '📚', goalMet: false,
            feedback: 'The Professor analyzed the soil, but gardens need hands-on love.',
            panelNarrations: [
                n("The Professor measures soil pH. \"Fascinating!\"", 'happy', 'exclamation', 'Professor'),
                n("Maya tends house plants, dreaming of the garden outside.", 'worried', 'none'),
                n("Sam climbs trees. \"Wheee!\"", 'happy', 'exclamation', 'Sam'),
            ]
        },
        {
            id: 'c2_wild', type: 'partial', title: 'Wild Growth', badge: '🌿', goalMet: false,
            feedback: "Sam's energy made things grow... too wild!",
            panelNarrations: [
                n("Sam dumps water everywhere. The garden becomes a swamp!", 'happy', 'exclamation'),
                n("Maya tries to tame the forest. \"This isn't what I meant...\"", 'worried', 'question', 'Maya'),
                n("The Professor sighs. \"Perhaps a measured approach?\"", 'neutral', 'none', 'Professor'),
            ]
        },
        {
            id: 'c2_miracle', type: 'secret', title: '🌺 The Garden Miracle', badge: '🔮', goalMet: true,
            feedback: 'Secret ending! The planted flower became a whole meadow of color!',
            panelNarrations: [
                n("Maya plants the special flower in the center. It glows softly.", 'happy', 'sparkle', 'Narrator'),
                n("Sam watches from the forest, amazed. \"It's... spreading!\"", 'happy', 'stars', 'Sam'),
                n("Professor drops his notes. \"Impossible! It's... beautiful.\"", 'happy', 'sparkle', 'Professor'),
            ]
        },
        {
            id: 'c2_def', type: 'failure', title: 'Nothing Grows', badge: '🥀', goalMet: false,
            feedback: 'The garden remains dormant. Who has the greenest thumb?',
            panelNarrations: [
                n("The characters pace around, unsure how to help.", 'worried', 'question'),
                n("\"Does anyone actually know gardening?\"", 'neutral', 'none'),
                n("The garden waits patiently.", 'neutral', 'none'),
            ]
        },
    ],
};

// ════════════════════════════════════════════════════
// CHAPTER 3: The Bridge Between (existing, refined)
// ════════════════════════════════════════════════════
const CH3: PuzzleChapter = {
    id: 'ch3', title: 'The Bridge Between', theme: 'Friendship', panelCount: 3,
    goal: 'Bring two friends together on the bridge.',
    blurb: 'Two friends stand on opposite sides. Night watches. Can you build the path that reconnects them?',
    characters: [C.sam, C.elias, C.night], tokens: [],
    backgrounds: [B.bridge, B.lake, B.forest],
    hint: 'A bridge connects people...', defaultOutcomeId: 'c3_def', allowStacking: false,
    combinations: [
        { key: 'sam:forest|night:lake|elias:bridge', outcomeId: 'c3_reunion' },
        { key: 'elias:forest|sam:bridge|night:lake', outcomeId: 'c3_waiting' },
        { key: 'night:bridge|sam:lake|elias:forest', outcomeId: 'c3_moonlit' },
    ],
    outcomes: [
        {
            id: 'c3_reunion', type: 'success', title: 'Friends Reunited', badge: '🤝', goalMet: true,
            feedback: 'Elias waited at the bridge, Sam found the way!',
            panelNarrations: [
                n("Sam pushes through the dark forest. \"I know Elias is waiting!\"", 'worried', 'none', 'Sam'),
                n("Night turns the lake into a mirror of stars.", 'neutral', 'stars'),
                n("They meet on the bridge and embrace.", 'happy', 'hearts'),
            ]
        },
        {
            id: 'c3_waiting', type: 'partial', title: 'The Long Wait', badge: '⏳', goalMet: false,
            feedback: 'Sam stood on the bridge, but Elias got lost.',
            panelNarrations: [
                n("Elias wanders deeper into the forest.", 'worried', 'question'),
                n("Sam scans the treeline. \"Where are you?\"", 'worried', 'none', 'Sam'),
                n("Night settles, reflecting Sam's lonely silhouette.", 'neutral', 'wisps'),
            ]
        },
        {
            id: 'c3_moonlit', type: 'secret', title: '🌙 Moonlit Crossing', badge: '🔮', goalMet: true,
            feedback: 'Secret! Night itself became the bridge between friends.',
            panelNarrations: [
                n("Night wraps the bridge in starlight and moonbeams.", 'happy', 'stars'),
                n("Sam sees Elias's reflection. \"He's closer than I thought!\"", 'happy', 'sparkle', 'Sam'),
                n("Elias emerges, guided by moonlight. \"I followed the stars.\"", 'happy', 'stars', 'Elias'),
            ]
        },
        {
            id: 'c3_def', type: 'failure', title: 'Ships Passing', badge: '🚢', goalMet: false,
            feedback: 'Everyone went their own way. The bridge needs someone standing on it!',
            panelNarrations: [
                n("The characters scatter.", 'neutral', 'question'),
                n("\"Shouldn't we go toward each other?\"", 'worried', 'exclamation'),
                n("The bridge sits empty under moonlight.", 'neutral', 'wisps'),
            ]
        },
    ],
};

// ════════════════════════════════════════════════════
// CHAPTER 4: The Lantern of Worries
// ════════════════════════════════════════════════════
const CH4: PuzzleChapter = {
    id: 'ch4', title: 'The Lantern of Worries', theme: 'Letting Go', panelCount: 3,
    goal: 'Release the worries into the night sky.',
    blurb: 'Leo carries a lantern heavy with anxious thoughts. With help, he can release them into the sky.',
    characters: [C.leo, C.asha, C.luna], tokens: [T.lantern],
    backgrounds: [B.nightSky, B.meadow, B.lake],
    hint: 'The lantern needs to reach the night sky...', defaultOutcomeId: 'c4_def', allowStacking: true,
    combinations: [
        { key: 'leo+lantern:meadow|asha:lake|luna:nightSky', outcomeId: 'c4_release' },
        { key: 'leo:nightSky|luna:lake|asha:meadow', outcomeId: 'c4_overwhelm' },
        { key: 'asha:meadow|leo:lake|luna+lantern:nightSky', outcomeId: 'c4_guided' },
        { key: 'luna+lantern:nightSky|leo:meadow|asha:lake', outcomeId: 'c4_starlight' },
    ],
    outcomes: [
        {
            id: 'c4_release', type: 'success', title: 'Worries Released', badge: '🏮', goalMet: true,
            feedback: 'Leo let go. The lantern rose, and the worries turned into fireflies.',
            panelNarrations: [
                n("Leo holds the lantern tight. \"What if I let go?\" he whispers.", 'worried', 'wisps', 'Leo'),
                n("Asha's calm voice drifts across the lake. \"You're safe. Let them go.\"", 'neutral', 'sparkle', 'Asha'),
                n("Luna watches from the starfield as the lantern rises and dissolves into light.", 'happy', 'stars', 'Luna'),
            ]
        },
        {
            id: 'c4_overwhelm', type: 'failure', title: 'Overwhelmed', badge: '😰', goalMet: false,
            feedback: 'The night sky was too vast for Leo alone. He needs a guide.',
            panelNarrations: [
                n("Leo looks up at the infinite sky. It's too much.", 'worried', 'wisps', 'Leo'),
                n("Luna drifts on the lake, too far to help.", 'neutral', 'none'),
                n("Asha waits in the meadow, unaware.", 'neutral', 'question', 'Asha'),
            ]
        },
        {
            id: 'c4_guided', type: 'partial', title: 'Guided Breath', badge: '🌬️', goalMet: false,
            feedback: 'Asha taught Leo to breathe, but the lantern stayed unlit.',
            panelNarrations: [
                n("Asha sits with Leo in the meadow. \"Breathe with me.\"", 'neutral', 'sparkle', 'Asha'),
                n("Leo stands by the lake, calmer now, watching reflections.", 'neutral', 'none', 'Leo'),
                n("Luna places the lantern in the sky, but it's empty without Leo's worries.", 'worried', 'question'),
            ]
        },
        {
            id: 'c4_starlight', type: 'secret', title: '⭐ Stellae Liberae', badge: '🔮', goalMet: true,
            feedback: 'Secret ending! Luna transformed the worries into new constellations.',
            panelNarrations: [
                n("Luna weaves the lantern's glow into the stars themselves.", 'happy', 'stars', 'Luna'),
                n("Leo feels lighter in the meadow. \"The stars... they're my worries, but beautiful.\"", 'happy', 'sparkle', 'Leo'),
                n("Asha smiles across the lake. \"You turned pain into art.\"", 'happy', 'hearts', 'Asha'),
            ]
        },
        {
            id: 'c4_def', type: 'failure', title: 'Still Carrying', badge: '😔', goalMet: false,
            feedback: 'The worries remain heavy. Leo needs someone by his side.',
            panelNarrations: [
                n("Leo clutches the lantern tighter.", 'worried', 'wisps'),
                n("\"I can't do this alone...\"", 'worried', 'none', 'Leo'),
                n("The meadow grows cold and silent.", 'neutral', 'wisps'),
            ]
        },
    ],
};

// ════════════════════════════════════════════════════
// CHAPTER 5: The Lost Compass
// ════════════════════════════════════════════════════
const CH5: PuzzleChapter = {
    id: 'ch5', title: 'The Lost Compass', theme: 'Purpose', panelCount: 3,
    goal: 'Help the traveler find their true direction.',
    blurb: 'Noor has wandered far but lost her way. The compass points everywhere and nowhere. Who can help?',
    characters: [C.noor, C.professor, C.rowan], tokens: [T.compass],
    backgrounds: [B.forest, B.cliff, B.study],
    hint: 'A compass needs a calm hand to read...', defaultOutcomeId: 'c5_def', allowStacking: true,
    combinations: [
        { key: 'noor+compass:cliff|professor:study|rowan:forest', outcomeId: 'c5_trueNorth' },
        { key: 'professor+compass:study|noor:forest|rowan:cliff', outcomeId: 'c5_academic' },
        { key: 'rowan:cliff|noor:forest|professor:study', outcomeId: 'c5_instinct' },
        { key: 'noor:forest|rowan+compass:cliff|professor:study', outcomeId: 'c5_artPath' },
    ],
    outcomes: [
        {
            id: 'c5_trueNorth', type: 'success', title: 'True North', badge: '🧭', goalMet: true,
            feedback: 'From the clifftop, Noor finally sees where she truly wants to go.',
            panelNarrations: [
                n("Noor stands at the cliff's edge, compass steady at last.", 'neutral', 'sparkle', 'Noor'),
                n("Professor nods from his study. \"The view changes everything.\"", 'happy', 'none', 'Professor'),
                n("Rowan paints the moment from the forest below.", 'happy', 'hearts', 'Rowan'),
            ]
        },
        {
            id: 'c5_academic', type: 'partial', title: 'Book Knowledge', badge: '📖', goalMet: false,
            feedback: 'The Professor explained navigation, but Noor needs to feel it.',
            panelNarrations: [
                n("Professor studies the compass. \"Declination is 12 degrees.\"", 'neutral', 'none', 'Professor'),
                n("Noor wanders the forest in circles.", 'worried', 'question', 'Noor'),
                n("Rowan sketches from the clifftop. \"Just look around you!\"", 'neutral', 'exclamation', 'Rowan'),
            ]
        },
        {
            id: 'c5_instinct', type: 'partial', title: 'Following Instinct', badge: '🦋', goalMet: false,
            feedback: 'None had the compass. Sometimes you need tools and heart together.',
            panelNarrations: [
                n("Rowan sees the sunset from the cliff. Beautiful, but where now?", 'neutral', 'sparkle'),
                n("Noor hears birds in the forest. \"Maybe I'll follow them...\"", 'neutral', 'none', 'Noor'),
                n("Professor reads quietly. \"I wish they'd asked me.\"", 'worried', 'none', 'Professor'),
            ]
        },
        {
            id: 'c5_artPath', type: 'secret', title: '🎨 The Painted Path', badge: '🔮', goalMet: true,
            feedback: 'Secret! Rowan used the compass to paint a map that spoke to Noor\'s heart.',
            panelNarrations: [
                n("Noor meditates in the forest, listening to the wind.", 'neutral', 'sparkle', 'Noor'),
                n("Rowan uses the compass to paint the landscape. The painting glows.", 'happy', 'stars', 'Rowan'),
                n("Professor sees the painting. \"Art IS the map. Brilliant.\"", 'happy', 'sparkle', 'Professor'),
            ]
        },
        {
            id: 'c5_def', type: 'failure', title: 'Still Lost', badge: '🌀', goalMet: false,
            feedback: 'The compass spins aimlessly. Try pairing it with someone.',
            panelNarrations: [
                n("Everyone stands in different places.", 'worried', 'question'),
                n("The compass spins and spins.", 'neutral', 'wisps'),
                n("\"Which way is home?\" No answer comes.", 'worried', 'none'),
            ]
        },
    ],
};

// stories 6-10 are in puzzleData2
import { CH6, CH7, CH8, CH9, CH10 } from './puzzleData2';

export const ALL_CHAPTERS: PuzzleChapter[] = [CH1, CH2, CH3, CH4, CH5, CH6, CH7, CH8, CH9, CH10];

export { C, B, T } from './sharedData';
