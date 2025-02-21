import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import axios from "axios";
import { commitSession, getSession } from "~/utils/session.server";


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const response = await axios.post(`https://candidate-testing.com/api/v2/token`, {
            email,
            password,
        });

        const session = await getSession(request.headers.get("Cookie"));
        console.log("response==>", response);
        session.set("token", response.data.token_key);

        return redirect("/profile", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error) {
        return { error: "Invalid credentials" };
    }
};

export default function Login() {
    const actionData = useActionData();
    return (
        <Form method="post">
            <div>
                <label>Email</label>
                <input type="email" name="email" required />
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" required />
            </div>
            {actionData?.error && <p>{actionData.error}</p>}
            <button type="submit">Login</button>
        </Form>
    );
}