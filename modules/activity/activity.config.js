export const activityConfig = {
    name: 'activity-module',
    version: '1.0.0',
    dependencies: ['core', 'ai'],
    routes: [
        '/activities',
        '/submissions',
        '/voting'
    ],
    database: {
        collections: ['activities', 'submissions', 'votes'],
        indexes: ['activityId', 'userId', 'status']
    },
    components: [
        'ActivityPlatform',
        'WorkSubmission',
        'VotingSystem'
    ]
};
