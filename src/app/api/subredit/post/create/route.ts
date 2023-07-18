import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { title, content, subredditId } = PostValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session?.user?.id
            }
        });

        if (!subscriptionExists) {
            return new Response("Subscribe to Post.", { status: 400 });
        }

        await db.post.create({
            data: {
                title,
                content,
                subredditId,
                authorId: session?.user.id
            }
        });


        return new Response("OK");
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("Invalid Post request Data Passed", { status: 422 });
        }

        return new Response("Couldn't post to subreddit at the moment, please try again later", { status: 500 });
    }
}