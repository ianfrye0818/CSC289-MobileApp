import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { type CustomerDetails } from '@/features/customer/types';
import { formatPhoneNumber } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface AccountCardProps {
  customer: CustomerDetails;
}


export function AccountCard({ customer }: AccountCardProps) {
  const { firstName, lastName, email, phone } = customer;
  const router = useRouter();

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();


  return (
    <Pressable onPress={() => router.push(`/account/${customer.id}`)}>
      <Card className="w-full">
        <CardContent className="flex-row items-center gap-4">
          <Avatar alt={''} className="size-16">
            <AvatarFallback>
              <Text className="font-semibold text-lg">{initials}</Text>
            </AvatarFallback>
          </Avatar>

          <View className="flex-1 gap-1">
            <Text className="font-semibold text-base">{firstName} {lastName}</Text>
            <Text className="text-muted-foreground text-sm">{email}</Text>
            <Text className="text-muted-foreground text-sm">{formatPhoneNumber(phone ?? undefined)}</Text>
          </View>
          <View className="flex-row items-center">
            <ChevronRight size={18} className="text-muted-foreground" />
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
