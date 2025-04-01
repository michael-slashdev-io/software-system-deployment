from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Client, Package, Deployment
from .serializers import ClientSerializer, PackageSerializer, DeploymentSerializer
from .tasks import process_deployment
from django.utils import timezone

class ClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows clients to be viewed or edited.
    """
    queryset = Client.objects.all().order_by('-last_checkin')
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Optionally restricts the returned clients by filtering
        """
        queryset = Client.objects.all().order_by('-last_checkin')
        status = self.request.query_params.get('status')
        os_type = self.request.query_params.get('os_type')
        
        if status:
            queryset = queryset.filter(status=status)
        if os_type:
            queryset = queryset.filter(os_type=os_type)
            
        return queryset

class PackageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows packages to be viewed or edited.
    """
    queryset = Package.objects.all().order_by('-created_at')
    serializer_class = PackageSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeploymentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows deployments to be viewed or edited.
    """
    queryset = Deployment.objects.all().order_by('-created_at')
    serializer_class = DeploymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Queue deployment job
        process_deployment.delay(serializer.instance.id)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def client_checkin(request):
    """
    Endpoint for client check-in to update status and get pending deployments.
    """
    hostname = request.data.get('hostname')
    ip_address = request.data.get('ip_address')
    os_type = request.data.get('os_type')
    
    try:
        client = Client.objects.get(hostname=hostname)
        client.status = 'online'
        client.ip_address = ip_address
        client.last_checkin = timezone.now()
        client.save()
    except Client.DoesNotExist:
        # Create new client
        client = Client.objects.create(
            hostname=hostname,
            ip_address=ip_address,
            status='online',
            os_type=os_type
        )
    
    # Get pending deployments for this client
    pending_deployments = Deployment.objects.filter(
        client=client,
        status='pending'
    )
    
    deployment_data = DeploymentSerializer(pending_deployments, many=True).data
    
    return Response({
        'status': 'success',
        'client_id': client.id,
        'pending_deployments': deployment_data
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_deployment_status(request, pk):
    """
    Endpoint for clients to update deployment status.
    """
    try:
        deployment = Deployment.objects.get(pk=pk)
        new_status = request.data.get('status')
        
        if new_status in dict(Deployment.STATUS_CHOICES):
            deployment.status = new_status
            deployment.save()
            return Response({'status': 'success'})
        return Response({'status': 'error', 'message': 'Invalid status'}, status=400)
    except Deployment.DoesNotExist:
        return Response({'status': 'error', 'message': 'Deployment not found'}, status=404)