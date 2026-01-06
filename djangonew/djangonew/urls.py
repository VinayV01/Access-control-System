"""
URL configuration for djangonew project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from myapp.views import UserProfileView,AssignPermissionView,AuditLogView,MyProfileView,UserListView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

        path('api/login/', TokenObtainPairView.as_view(), name='login'),
        path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path("api/users/me/profile/", MyProfileView.as_view()),
        path("api/users/<int:user_id>/profile/", UserProfileView.as_view()),
        path("api/admin/assign-permission/", AssignPermissionView.as_view()),
        path("api/admin/audit-logs/", AuditLogView.as_view()),
        path("api/users/", UserListView.as_view()),

        
]
