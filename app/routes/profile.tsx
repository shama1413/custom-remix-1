import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import axios from "axios";
import { getSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("token");

    console.log("API URL from environment:", process.env.API_URL);

    if (!token) {
        return redirect("/login");
    }

    try {
        const [userResponse, authorsResponse, booksResponse] = await Promise.all([
            axios.get(`https://candidate-testing.com/api/v2/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            axios.get(`https://candidate-testing.com/api/v2/authors`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            axios.get(`https://candidate-testing.com/api/v2/books`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        ]);

        return json({
            user: userResponse.data,
            authors: authorsResponse.data,
            books: booksResponse.data,
        });
    } catch (error) {
        return redirect("/login");
    }
};

export default function Profile() {
    const { user, authors, books } = useLoaderData();

    return (
        <div>
            <h1>Profile</h1>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>

            <h2>Authors</h2>
            <ul>
                {authors.items.map((author: any) => (
                    <li key={author.id}>
                        <Link to={`/authors/${author.id}`}>{author.first_name}</Link>
                    </li>
                ))}
            </ul>

            <h2>Books</h2>
            <ul>
                {books.items.map((book: any) => (
                    <li key={book.id}>
                        <Link to={`/books/${book.id}`}>{book.title}</Link>
                    </li>
                ))}
            </ul>

            <Form action="/logout" method="post">
                <button type="submit">Logout</button>
            </Form>
        </div>
    );
}