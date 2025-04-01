from django.db import models

# Stores information about a client machine.
class Client(models.Model):
    # Options for client status: online or offline.
    STATUS_CHOICES = [
        ('online', 'Online'), 
        ('offline', 'Offline'),
    ]
    
    # Options for the os of the client.
    OS_CHOICES = [
        ('windows', 'Windows'), 
        ('macos', 'macOS'), 
        ('linux', 'Linux'),
    ]

    # Fields to store client data.
    hostname = models.CharField(max_length=255, unique=True)  # Client's hostname (must be unique).
    ip_address = models.GenericIPAddressField()  # Client's IP address.
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='offline')  # Client's online status.
    os_type = models.CharField(max_length=10, choices=OS_CHOICES)  # Client's operating system.
    last_checkin = models.DateTimeField(auto_now=True)  # Last time the client checked in.

    # Displays the client’s hostname and status.
    def __str__(self):
        return f"{self.hostname} ({self.status})"

# Stores information about software packages.
class Package(models.Model):
    # Fields to store package details.
    name = models.CharField(max_length=255)  # Package name.
    version = models.CharField(max_length=50)  # Package version.
    created_at = models.DateTimeField(auto_now_add=True)  # Time when the package was added.

    # Displays the package name and version.
    def __str__(self):
        return f"{self.name} v{self.version}"

# Tracks deployment jobs for software packages.
class Deployment(models.Model):
    # Options for deployment status: pending, in progress, completed, or failed.
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    # Fields to store deployment details.
    client = models.ForeignKey(Client, on_delete=models.CASCADE)  # The client being deployed to.
    package = models.ForeignKey(Package, on_delete=models.CASCADE)  # The package being deployed.
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')  # Current deployment status.
    created_at = models.DateTimeField(auto_now_add=True)  # When the deployment was created.
    updated_at = models.DateTimeField(auto_now=True)  # When the deployment was last updated.

    # Displays the package, client, and status of the deployment.
    def __str__(self):
        return f"Deployment of {self.package} to {self.client} - {self.status}"
