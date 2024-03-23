import { ReactNode, createContext, useContext, useState } from "react";

type Props = {
    children: ReactNode
}

type MyBooksContextType = {
    onToggleSaved: (book: Book) => void;
    isBookSaved: (book: Book) => boolean;
    savedBooks: Book[];
}

const MyBooksContext = createContext<MyBooksContextType>({
    onToggleSaved: () => { },
    isBookSaved: () => false,
    savedBooks: []
})


const MyBooksProvider = ({ children }: Props) => {

    const [savedBooks, setSavedBooks] = useState<Book[]>([])

    const areBookTheSame = (a: Book, b: Book) => {
        return JSON.stringify(a) === JSON.stringify(b)
    }

    const isBookSaved = (book: Book) => {
        return savedBooks.some(savedBook => areBookTheSame(savedBook, book)) //return true if at least one savedBook in arr = book we press. json.stringify needs to be compared by value, not reference
    }

    const onToggleSaved = (book: Book) => {
        if (isBookSaved(book)) {
            setSavedBooks(books => books.filter((savedBook) => !areBookTheSame(savedBook, book)))
        } else {
            setSavedBooks((books) => [book, ...books])
        }
    }

    return (
        <MyBooksContext.Provider value={{ onToggleSaved, isBookSaved, savedBooks }}>
            {children}
        </MyBooksContext.Provider>
    )
}

//useMyBooks - custom hook which is a function. when it's called it trigger useContect() with our MyBooksContext inside.
export const useMyBooks = () => useContext(MyBooksContext)

export default MyBooksProvider