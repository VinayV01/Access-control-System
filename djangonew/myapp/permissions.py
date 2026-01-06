from django.utils.timezone import now
from .models import UserPermission

def has_permission(user, permission_code, target_user=None):
    """
    user: who is making the request
    permission_code: required permission (string)
    target_user: whose data is being accessed (optional)
    """

    current_time = now()

    permissions = UserPermission.objects.filter(
        user=user,
        permission__code=permission_code,
        revoked=False
    )

    for perm in permissions:

        # ⏱ Time-based checks
        if perm.start_at and perm.start_at > current_time:
            continue

        if perm.end_at and perm.end_at < current_time:
            continue

        # 🌍 Global scope
        if perm.scope == "global":
            return True

        # 👤 Self scope
        if perm.scope == "self" and target_user == user:
            return True

        # 👥 Team scope
        if (
            perm.scope == "team"
            and target_user
            and user.team
            and target_user.team == user.team
        ):
            return True

    return False
