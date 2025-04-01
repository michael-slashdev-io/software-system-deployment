from django.contrib import admin
from .models import Client, Package, Deployment

# Registers the client model in the admin interface.
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    # Fields to display in the list view.
    # Options to filter the list view by status and operating system.
    # Fields to search by in the admin interface.
    list_display = ('hostname', 'ip_address', 'status', 'os_type', 'last_checkin')
    list_filter = ('status', 'os_type')
    search_fields = ('hostname', 'ip_address')

# Registers the Package model in the admin interface.
@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    # Fields to display in the list view.
    # Fields to search by in the admin interface.
    list_display = ('name', 'version', 'created_at')
    search_fields = ('name', 'version')

# Registers the Deployment model in the admin interface.
@admin.register(Deployment)
class DeploymentAdmin(admin.ModelAdmin):
    # Fields to display in the list view.
    # Option to filter the list view by deployment status.
    # Fields to search by in the admin interface.
    list_display = ('id', 'client', 'package', 'status', 'created_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('client__hostname', 'package__name')
