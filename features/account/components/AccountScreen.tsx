import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center">
            <Text className="text-2xl font-bold text-foreground">
                Account Screen
            </Text>
            <Text className="text-base text-muted-foreground mt-2">
                This is a placeholder for the Account screen. It will display user information and account settings in the future.
            </Text>
        </SafeAreaView>
    );
}