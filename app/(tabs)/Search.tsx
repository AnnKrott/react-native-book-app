import { ActivityIndicator, Button, FlatList, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { gql, useLazyQuery } from '@apollo/client';
import BookItem from '@/components/bookItem';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`;


export default function Search() {

  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState<'googleBooksSearch' | 'openLibrarySearch'>('googleBooksSearch')

  const parseBook = (item: any): Book => {
    if (provider === 'googleBooksSearch')
      return {
        image: item.volumeInfo.imageLinks?.thumbnail,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : 'Not found'
      }
    return {
      image: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,
      title: item.title,
      authors: item.author_name,
      isbn: item.isbn?.[0],
    }
  }

  const [runQuery, { data, loading, error }] = useLazyQuery(query) //Query works after every change of input text, lazy query will change only when you tell it to run. Destrucured as arr, first parameter - function, second - object. For query - destruct as object. { variables: { q: search } } is removed from useLazyQuery arguments, cause variable will be defined when we want to run the query

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search...'
          style={styles.input}
        />
        <Button title='Search' color='coral' onPress={() => runQuery({ variables: { q: search } })} />
      </View>

      <View style={styles.tabs}>
        <Text style={
          provider === 'googleBooksSearch'
            ? { fontWeight: 'bold', color: 'orange' }
            : {}
        }
          onPress={() => setProvider('googleBooksSearch')}
        >
          Google Books
        </Text>
        <Text style={
          provider === 'openLibrarySearch'
            ? { fontWeight: 'bold', color: 'orange' }
            : {}
        }
          onPress={() => setProvider('openLibrarySearch')}
        >
          Open Library
        </Text>
      </View>

      {loading && <ActivityIndicator />}
      {error && <View>
        <Text>Error fetching books</Text>
        <Text>{error.message}</Text>
      </View>}
      <FlatList
        data={
          provider === 'googleBooksSearch'
            ? data?.googleBooksSearch?.items
            : data?.openLibrarySearch?.docs
            || []
        }
        renderItem={({ item }) => <BookItem book={parseBook(item)} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  input: {
    flex: 1, //takes all free space
    borderWidth: 1,
    borderColor: 'gainsboro',
    borderRadius: 4,
    padding: 7,
    paddingLeft: 10,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
  }
});
