import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, Mail, User } from 'lucide-react';

import type { User as UserType } from '@/types/user';

type ProfileDetailsProps = {
  user: UserType;
  onEdit: () => void;
};

function ProfileDetails({ user, onEdit }: ProfileDetailsProps) {
  return (
    <Card className="card-modern">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">Account Information</CardTitle>
            <CardDescription className="pt-1">View and manage your account details</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-2 hover-lift">
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
          <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-md border">
            <User className="h-4 w-4 text-muted-foreground" />
            {user.name}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
          <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-md border">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {user.email}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileDetails;
