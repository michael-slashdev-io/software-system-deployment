from django.contrib import admin
from .models import Client, Package, Deployment

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('hostname', 'ip_address', 'status', 'os_type', 'last_checkin')
    list_filter = ('status', 'os_type')
    search_fields = ('hostname', 'ip_address')

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'version', 'created_at')
    search_fields = ('name', 'version')

@admin.register(Deployment)
class DeploymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'package', 'status', 'created_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('client__hostname', 'package__name')