import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: "__session",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        secrets: ["s3cret1"],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    },
});

export { getSession, commitSession, destroySession };