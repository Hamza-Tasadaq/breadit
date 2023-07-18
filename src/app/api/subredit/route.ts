import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubreditValidator } from "@/lib/validators/subredit";
import { error } from "console";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { name } = SubreditValidator.parse(body);

        const subreditExists = await db.subreddit.findFirst({
            where: {
                name
            }
        });

        if (subreditExists) {
            return new Response("Subredit Already Exists", { status: 409 });
        }

        const subredit = await db.subreddit.create({
            data: {
                name,
                creatorId: session?.user.id
            }
        });

        await db.subscription.create({
            data: {
                userId: session?.user?.id,
                subredditId: subredit?.id
            }
        });

        return new Response(subredit.name);
    } catch (err) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 });
        }

        return new Response("Couldn't Create Subredit", { status: 500 });
    }
}