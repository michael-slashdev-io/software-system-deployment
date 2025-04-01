from rest_framework import serializers
from .models import Client, Package, Deployment

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'hostname', 'ip_address', 'status', 'os_type', 'last_checkin']

class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ['id', 'name', 'version', 'created_at']

class DeploymentSerializer(serializers.ModelSerializer):
    client_hostname = serializers.ReadOnlyField(source='client.hostname')
    package_name = serializers.ReadOnlyField(source='package.name')
    package_version = serializers.ReadOnlyField(source='package.version')

    class Meta:
        model = Deployment
        fields = [
            'id', 'client', 'client_hostname', 'package', 'package_name', 
            'package_version', 'status', 'created_at', 'updated_at'
        ]