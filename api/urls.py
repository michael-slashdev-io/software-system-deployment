from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'clients', views.ClientViewSet)
router.register(r'packages', views.PackageViewSet)
router.register(r'deployments', views.DeploymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('client-checkin/', views.client_checkin, name='client-checkin'),
    path('update-deployment/<int:pk>/', views.update_deployment_status, name='update-deployment'),
]