import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { type CustomerDetails } from '@/features/customer/types';

interface ContactCardProps {
  customer: CustomerDetails;
}

export function ContactCard({ customer }: ContactCardProps) {
  const {  email, phone } = customer;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription>{email}</CardDescription>
        <CardDescription>{phone}</CardDescription>
      </CardHeader>
    </Card>
  );
}