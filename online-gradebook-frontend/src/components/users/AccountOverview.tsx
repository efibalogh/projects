import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { User as UserType } from '@/types/user';

import DeleteDialog from '@/components/common/DeleteDialog';

type AccountOverviewProps = {
  user: UserType;
  onDeleteAccount: () => Promise<void>;
};

function AccountOverview({ user, onDeleteAccount }: AccountOverviewProps) {
  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="text-lg">Account Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Role</span>
            <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'}>
              {user.role === 'teacher' ? 'Teacher' : 'Student'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">User ID</span>
            <span className="text-sm font-mono">#{user.id}</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-border/50">
          <div className="space-y-2">
            <DeleteDialog
              title="Delete Account"
              description={`Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, including courses ${
                user.role === 'teacher' ? 'you have created' : 'you are enrolled in'
              } and associated information.`}
              onDelete={onDeleteAccount}
              triggerVariant="medium"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountOverview;
