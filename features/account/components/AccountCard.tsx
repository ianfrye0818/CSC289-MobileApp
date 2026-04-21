import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { type CustomerDetails } from '@/features/customer/types';

interface AccountCardProps {
  customer: CustomerDetails;
}

export function AccountCard({ customer }: AccountCardProps) {
  const { firstName, lastName, email, phone } = customer;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle> <IconSymbol size = {20} name='person.fill'/>{firstName} {lastName} </CardTitle>
        <CardDescription>{email}</CardDescription>
        <CardDescription>{phone}</CardDescription>
      </CardHeader>
    </Card>
  );
}