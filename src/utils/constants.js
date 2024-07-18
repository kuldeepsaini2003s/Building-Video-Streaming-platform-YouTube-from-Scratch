export const YOUTUBE_API_KEY = "AIzaSyD-2yb55I7K7dbBHWEZyK3ZXl7OVfHO-y4";

export const YOUTUBE_VIDEOS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_CHANNEL_NAME =
  "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=UC2bNrKQbJLphxNCd6BSnTkA&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_COMMENTS_API =
  "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=_VB39Jo8mAQ&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_CATEGORIES_API =
  "https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_RECOMMENDED_VIDEOS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=" +
  YOUTUBE_API_KEY;
