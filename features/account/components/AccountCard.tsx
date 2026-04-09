import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type CustomerDetails } from '@/features/customer/types';

interface AccountCardProps {
  customer: CustomerDetails;
}

export function AccountCard({ customer }: AccountCardProps) {
  const { firstName, lastName, email } = customer;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{firstName} {lastName}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
    </Card>
  );
}