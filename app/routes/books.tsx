import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import axios from "axios";
import { getSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("token");

    const url = new URL(request.url);
    const page = url.searchParams.get("page") || 1;
    const search = url.searchParams.get("search") || "";

    const response = await axios.get(`${process.env.API_URL}/api/v2/books`, {
        params: {
            page,
            search,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return json(response.data);
};

export default function Books() {
    const books = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({ search: e.target.value });
    };

    return (
        <div>
            <input type="text" placeholder="Search books..." onChange={handleSearch} />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Genre</th>
                        <th>Publication Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book: any) => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author.name}</td>
                            <td>{book.genre}</td>
                            <td>{book.publicationYear}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}