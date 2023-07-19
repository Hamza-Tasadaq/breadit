import { ExtendedPost } from "@/types/db";
import { FC } from "react";

interface PostFeedProps {
  initalPosts: ExtendedPost;
  subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initalPosts, subredditName }) => {
  return <div>PostFeed</div>;
};

export default PostFeed;
