from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import (
    Team,
    Permission,
    Role,
    UserPermission,
    AuditLog,
    UserRole,
)

admin.site.unregister(User)

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Team Information", {"fields": ("team",)}),
    )

admin.site.register(User, CustomUserAdmin)

admin.site.register(Team)
admin.site.register(Permission)
admin.site.register(Role)
admin.site.register(UserPermission)

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ("user", "role")

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        user = obj.user
        role = obj.role

        for perm in role.permissions.all():
            UserPermission.objects.get_or_create(
                user=user,
                permission=perm,
                defaults={"scope": "global"}
            )

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    readonly_fields = ("actor", "action", "timestamp", "metadata")

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
