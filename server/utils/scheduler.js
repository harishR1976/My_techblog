const Post = require('../models/Post');

const publishScheduledPosts = async () => {
  try {
    const now = new Date();
    const result = await Post.updateMany(
      {
        status: 'scheduled',
        scheduledAt: { $lte: now },
      },
      {
        $set: {
          status: 'published',
          publishedAt: now,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[Scheduler] Published ${result.modifiedCount} scheduled post(s)`);
    }
  } catch (error) {
    console.error(`[Scheduler] Error publishing posts: ${error.message}`);
  }
};

const startScheduler = (intervalMs = 60000) => {
  publishScheduledPosts();
  return setInterval(publishScheduledPosts, intervalMs);
};

module.exports = {
  publishScheduledPosts,
  startScheduler,
  startPostScheduler: startScheduler,
};
