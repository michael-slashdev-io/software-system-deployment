from rest_framework import serializers
from .models import Client, Package, Deployment

# Serializer to convert Client model data into JSON format
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client  # The model to serialize.
        fields = ['id', 'hostname', 'ip_address', 'status', 'os_type', 'last_checkin']  # Fields to include in the serialized output

# Serializer to convert Package model data into JSON format
class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package  # The model to serialize.
        fields = ['id', 'name', 'version', 'created_at']  # Fields to include in the serialized output

# Serializer to convert Deployment model data into JSON format with additional details.
class DeploymentSerializer(serializers.ModelSerializer):
    # Adding client hostname and package name/version as read-only fields.
    client_hostname = serializers.ReadOnlyField(source='client.hostname')
    package_name = serializers.ReadOnlyField(source='package.name')
    package_version = serializers.ReadOnlyField(source='package.version')

    class Meta:
        model = Deployment  # The model to serialize.
        fields = [
            'id', 'client', 'client_hostname', 'package', 'package_name', 
            'package_version', 'status', 'created_at', 'updated_at'
        ]  # Fields to include in the serialized output.
