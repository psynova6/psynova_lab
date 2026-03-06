// Character and Background seed data

export const CHARACTERS = {
    story_1: [
        { id: 'elias', storyId: 'story_1', name: 'Elias', spritePrefix: 'elias', defaultExpression: 'neutral' },
        { id: 'professor_s1', storyId: 'story_1', name: 'Professor', spritePrefix: 'professor', defaultExpression: 'neutral' },
        { id: 'mina_s1', storyId: 'story_1', name: 'Mina', spritePrefix: 'mina', defaultExpression: 'neutral' },
    ],
    story_2: [
        { id: 'maya', storyId: 'story_2', name: 'Maya', spritePrefix: 'maya', defaultExpression: 'neutral' },
        { id: 'night_s2', storyId: 'story_2', name: 'Night', spritePrefix: 'night', defaultExpression: 'neutral' },
    ],
    story_3: [
        { id: 'sam', storyId: 'story_3', name: 'Sam', spritePrefix: 'sam', defaultExpression: 'neutral' },
        { id: 'dracula_s3', storyId: 'story_3', name: 'Dracula', spritePrefix: 'dracula', defaultExpression: 'neutral' },
        { id: 'professor_s3', storyId: 'story_3', name: 'Professor', spritePrefix: 'professor', defaultExpression: 'neutral' },
    ],
};

export const BACKGROUNDS = {
    story_1: [
        { id: 'bg_library_s1', storyId: 'story_1', name: 'Library Evening', file: 'library_evening.png' },
        { id: 'bg_room_s1', storyId: 'story_1', name: 'Room & Desk', file: 'room_desk.png' },
        { id: 'bg_bridge_s1', storyId: 'story_1', name: 'City Bridge', file: 'city_bridge.png' },
    ],
    story_2: [
        { id: 'bg_garden_s2', storyId: 'story_2', name: 'Garden Day', file: 'garden_day.png' },
        { id: 'bg_lake_s2', storyId: 'story_2', name: 'Lake Night', file: 'lake_night.png' },
        { id: 'bg_forest_s2', storyId: 'story_2', name: 'Forest Path', file: 'forest_path.png' },
    ],
    story_3: [
        { id: 'bg_bridge_s3', storyId: 'story_3', name: 'City Bridge', file: 'city_bridge.png' },
        { id: 'bg_forest_s3', storyId: 'story_3', name: 'Forest Path', file: 'forest_path.png' },
        { id: 'bg_room_s3', storyId: 'story_3', name: 'Room & Desk', file: 'room_desk.png' },
    ],
};

export const STORIES = [
    {
        id: 'story_1',
        title: 'The Unsent Letter',
        theme: 'Forgiveness',
        goal: 'Help Elias find peace with the past.',
        panelCount: 3,
        initialPrompt: 'Elias holds a letter he never sent. Arrange the scenes to help him let go.',
    },
    {
        id: 'story_2',
        title: 'The Quiet Garden',
        theme: 'Growth',
        goal: 'Restore the bloom to the neglected garden.',
        panelCount: 3,
        initialPrompt: 'Maya visits a withered garden. How can she bring it back to life?',
    },
    {
        id: 'story_3',
        title: 'Bridge Over Troubled Water',
        theme: 'Friendship',
        goal: 'Reconcile the two friends.',
        panelCount: 4,
        initialPrompt: 'Sam and Alex had a disagreement. Build a bridge between them.',
    },
];
