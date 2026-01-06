from django.shortcuts import render

from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from .models import UserPermission, Permission,AuditLog
from .utils import create_audit_log


from .permissions import has_permission


class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not has_permission(user, "VIEW_PROFILE", target_user=user):
            raise PermissionDenied("You do not have permission to view your profile")

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "team": user.team.name if user.team else None
        })


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

        # Permission enforcement
        if not has_permission(request.user, "VIEW_PROFILE", target_user):
            raise PermissionDenied("You do not have permission to view this profile")

        # Allowed → return data
        return Response({
            "id": target_user.id,
            "username": target_user.username,
            "email": target_user.email,
            "team": target_user.team.name if target_user.team else None
        })


class AssignPermissionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        #  Admin must have permission to manage permissions
        if not has_permission(request.user, "MANAGE_PERMISSIONS"):
            raise PermissionDenied("Not allowed to assign permissions")

        user_id = request.data.get("user_id")
        permission_code = request.data.get("permission_code")
        scope = request.data.get("scope")

        permission = Permission.objects.get(code=permission_code)

        user_permission = UserPermission.objects.create(
            user_id=user_id,
            permission=permission,
            scope=scope
        )

        #  Audit log
        create_audit_log(
            actor=request.user,
            action="Assigned permission",
            metadata={
                "user_id": user_id,
                "permission": permission_code,
                "scope": scope
            }
        )

        return Response(
            {"detail": "Permission assigned"},
            status=status.HTTP_201_CREATED
        )


class AuditLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not has_permission(request.user, "VIEW_AUDIT_LOGS"):
            raise PermissionDenied("Not allowed to view audit logs")

        logs = AuditLog.objects.all().order_by("-timestamp")

        return Response([
            {
                "actor": log.actor.username if log.actor else None,
                "action": log.action,
                "metadata": log.metadata,
                "timestamp": log.timestamp
            }
            for log in logs
        ])
    

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if has_permission(user, "VIEW_PROFILE"):
            users = User.objects.all()

        elif has_permission(user, "VIEW_PROFILE", target_user=user) and user.team:
            users = User.objects.filter(team=user.team)

        else:
            users = User.objects.filter(id=user.id)

        return Response([
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "team": u.team.name if u.team else None
            }
            for u in users
        ])



