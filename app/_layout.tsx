import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import MyBooksProvider from '@/context/myBooksProvier';

import { ApolloClient } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloProvider } from '@apollo/client/react';

import { useColorScheme } from '@/components/useColorScheme';

const API_KEY = "palmaresdosul::stepzen.net+1000::ab841cc58567c1027da9b52ae6347e2b3b1779fa18440fe5ff78642b65ba88e8"

const client = new ApolloClient({
  uri: "https://palmaresdosul.stepzen.net/api/queenly-panther/__graphql",
  headers: {
    Authorization: `Apikey ${API_KEY}`,
  },
  cache: new InMemoryCache(),
})

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ApolloProvider client={client}>
        <MyBooksProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </MyBooksProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
