import { ActivityIndicator, Button, FlatList, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import BookItem from '@/components/bookItem';
import React, { useState } from 'react';

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


export default function TabOneScreen() {

  const [search, setSearch] = useState('')

  const [runQuery, { data, loading, error }] = useLazyQuery(query) //Query works after every change of input text, lazy query will change only when you tell it to run. Destrucured as arr, first parameter - function, second - object. For query - destruct as object. { variables: { q: search } } is removed from useLazyQuery arguments, cause variable will be defined when we want to run the query

  return (

    <View style={styles.container}>

      <View style={styles.header}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search...'
          style={styles.input}
        />
        <Button title='Search' color='coral' onPress={() => runQuery({ variables: { q: search } })} />
      </View>

      {loading && <ActivityIndicator />}
      {error && <View>
        <Text>Error fetching books</Text>
        <Text>{error.message}</Text>
      </View>}
      <FlatList
        data={data?.googleBooksSearch?.items || []}
        renderItem={({ item }) => <BookItem book={{
          image: item.volumeInfo.imageLinks?.thumbnail,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors,
          isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : 'Not found'
        }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
    padding: 2,
    paddingLeft: 10,
  },
});
