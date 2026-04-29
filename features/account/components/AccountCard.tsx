import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type CustomerDetails } from '@/features/customer/types';
import { formatPhoneNumber } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

interface AccountCardProps {
  customer: CustomerDetails;
}


export function AccountCard({ customer }: AccountCardProps) {
  const { firstName, lastName, email, phone } = customer;
  const router = useRouter();


  return (
    <Pressable onPress={() => router.push(`/account/${customer.id}`)}>
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{firstName} {lastName}</CardTitle>
        <CardDescription>{email}</CardDescription>
        <CardDescription>{formatPhoneNumber(phone?? undefined)}</CardDescription>
      </CardHeader>
    </Card>
    </Pressable>
  );
}