from django.contrib import admin
from .models import Client, Package, Deployment

# Registers the Client model in the admin interface.
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    # Fields to display in the list view.
    list_display = ('hostname', 'ip_address', 'status', 'os_type', 'last_checkin')
    # Options to filter the list view by status and operating system.
    list_filter = ('status', 'os_type')
    # Fields to search by in the admin interface.
    search_fields = ('hostname', 'ip_address')

# Registers the Package model in the admin interface.
@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    # Fields to display in the list view.
    list_display = ('name', 'version', 'created_at')
    # Fields to search by in the admin interface.
    search_fields = ('name', 'version')

# Registers the Deployment model in the admin interface.
@admin.register(Deployment)
class DeploymentAdmin(admin.ModelAdmin):
    # Fields to display in the list view.
    list_display = ('id', 'client', 'package', 'status', 'created_at', 'updated_at')
    # Option to filter the list view by deployment status.
    list_filter = ('status',)
    # Fields to search by in the admin interface.
    search_fields = ('client__hostname', 'package__name')
