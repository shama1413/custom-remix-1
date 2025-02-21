import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { getSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("token");

    const response = await axios.get(`${process.env.API_URL}/api/v2/authors`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return json(response.data);
};

export default function Authors() {
    const authors = useLoaderData();
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Book Count</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {authors.map((author: any) => (
                    <tr key={author.id}>
                        <td>{author.name}</td>
                        <td>{author.bookCount}</td>
                        <td>
                            <button>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}