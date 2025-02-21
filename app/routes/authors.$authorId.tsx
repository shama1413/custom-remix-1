import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import axios from "axios";
import { getSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ params, request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("token");

    if (!token) {
        return redirect("/login");
    }

    if (!process.env.API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }

    const apiUrl = `${process.env.API_URL}/api/v2/authors/${params.authorId}`;
    console.log("Constructed API URL:", apiUrl);

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return json(response);
    } catch (error) {
        console.error("Error fetching author:", error);
        return redirect("/profile"); // Redirect to profile if the author is not found
    }
};

export default function AuthorDetail() {
    const author = useLoaderData();

    return (
        <div>
            <h1>{author.name}</h1>
            <p>Book Count: {author.bookCount}</p>

            <h2>Books</h2>
            <ul>
                {author.books.map((book: any) => (
                    <li key={book.id}>
                        <Link to={`/books/${book.id}`}>{book.title}</Link>
                    </li>
                ))}
            </ul>

            <Link to="/profile">Back to Profile</Link>
        </div>
    );
}