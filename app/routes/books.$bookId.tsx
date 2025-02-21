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

    try {
        const response = await axios.get(`https://candidate-testing.com/api/v2/books/${params.bookId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return json(response.data);
    } catch (error) {
        console.error("Error fetching book:", error);
        return redirect("/profile"); // Redirect to profile if the book is not found
    }
};

export default function BookDetail() {
    const book = useLoaderData();

    return (
        <div>
            <h1>{book.title}</h1>
            <p>Author: {book.author.name}</p>
            <p>Genre: {book.genre}</p>
            <p>Publication Year: {book.publicationYear}</p>
            <p>Description: {book.description}</p>

            <Link to="/profile">Back to Profile</Link>
        </div>
    );
}