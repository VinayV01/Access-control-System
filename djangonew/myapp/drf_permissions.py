from rest_framework.permissions import BasePermission
from .permissions import has_permission


class HasAppPermission(BasePermission):
    permission_code = None

    def has_permission(self, request, view):
        if not self.permission_code:
            return False
        return has_permission(request.user, self.permission_code)
