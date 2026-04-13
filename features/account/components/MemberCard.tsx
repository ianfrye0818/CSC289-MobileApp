import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type CustomerDetails } from '@/features/customer/types';

interface MemberCardProps {
  customer: CustomerDetails;
}

export function MemberCard({ customer }: MemberCardProps) {
  const { memberDetails } = customer;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Membership Level: {memberDetails.memberShipLevel} </CardTitle>
        <CardDescription>Discount Rate: {memberDetails.discountRate}</CardDescription>
      </CardHeader>  
    </Card>
  );
}