import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { gql, useQuery } from '@apollo/client';
import BookItem from '@/components/bookItem';

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

  const { data, loading, error } = useQuery(query, { variables: { q: "react native" } })

  // console.log(data, loading, error);


  return (
    <View style={styles.container}>
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
});
