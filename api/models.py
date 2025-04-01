from django.db import models

# Create your models here.
from django.db import models

# Stores client machine details.
class Client(models.Model):
    STATUS_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
    ]
    
    OS_CHOICES = [
        ('windows', 'Windows'),
        ('macos', 'macOS'),
        ('linux', 'Linux'),
    ]

    hostname = models.CharField(max_length=255, unique=True)
    ip_address = models.GenericIPAddressField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='offline')
    os_type = models.CharField(max_length=10, choices=OS_CHOICES)
    last_checkin = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.hostname} ({self.status})"

# Stores software package details.
class Package(models.Model):
    name = models.CharField(max_length=255)
    version = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} v{self.version}"


# Tracks deployment jobs.
class Deployment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Deployment of {self.package} to {self.client} - {self.status}"
