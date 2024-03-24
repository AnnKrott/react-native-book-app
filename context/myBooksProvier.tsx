import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        loadData()
    }, []) // load the data when the components mounts

    useEffect(() => {
        if (loaded) {
            persistData()
        }
    }, [savedBooks]) //when the arr of savedBooks changes, data is saved

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

    // write data to local storage
    const persistData = async () => {
        await AsyncStorage.setItem('bookData', JSON.stringify(savedBooks))
    }

    // read data from ls
    const loadData = async () => {
        const dataString = await AsyncStorage.getItem('bookData')
        if (dataString) {
            const items = JSON.parse(dataString)
            setSavedBooks(items)
        }
        setLoaded(true)
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