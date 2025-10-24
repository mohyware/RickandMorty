import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import { store } from '../src/store';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optional: Configure global query options
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      gcTime: 1000 * 60 * 10, // Keep data in memory for 10 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Rick and Morty Characters" }} />
          <Stack.Screen
            name="character-details/[id]"
            options={{
              title: "Character Details",
              presentation: "modal"
            }}
          />
        </Stack>
      </QueryClientProvider>
    </Provider>
  )
}
