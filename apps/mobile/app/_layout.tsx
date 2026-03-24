import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
    );
}
