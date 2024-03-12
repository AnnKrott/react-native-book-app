// google books api and open library api have the same information, but the queries for it are different.
// we need to unify 2 apis

type Book = {
    image: string;
    title: string;
    authors: string[];
    isbn: string;
}