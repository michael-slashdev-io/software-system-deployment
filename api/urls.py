from django.urls import path, include
from rest_framework import routers
from . import views

# Create a router and register viewsets for the models.
router = routers.DefaultRouter()
router.register(r'clients', views.ClientViewSet)  # Registers the Client viewset.
router.register(r'packages', views.PackageViewSet)  # Registers the Package viewset.
router.register(r'deployments', views.DeploymentViewSet)  # Registers the Deployment viewset.

# Define URL patterns for the API endpoints.
urlpatterns = [
    path('', include(router.urls)),  # Includes the automatically generated URLs for the viewsets.
    path('client-checkin/', views.client_checkin, name='client-checkin'),  # Endpoint for client check-in.
    path('update-deployment/<int:pk>/', views.update_deployment_status, name='update-deployment'),  # Endpoint to update deployment status.
]
