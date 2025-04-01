#!/usr/bin/env python3
"""
Client script for the Deployment System.

This script:
1. Registers with the server
2. Periodically checks in to update status
3. Polls for pending deployments
4. Simulates software installation
"""

import argparse
import json
import os
import platform
import random
import socket
import sys
import time
from datetime import datetime

import requests

# Configuration
DEFAULT_SERVER_URL = "http://localhost:8000"
DEFAULT_CHECK_INTERVAL = 30  # seconds
API_TOKEN = "YOUR_API_TOKEN_HERE"  # Replace with actual token

class DeploymentClient:
    def __init__(self, server_url, check_interval):
        self.server_url = server_url
        self.check_interval = check_interval
        self.hostname = socket.gethostname()
        self.ip_address = self._get_ip_address()
        self.os_type = self._get_os_type()
        self.client_id = None
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Token {API_TOKEN}"
        }
        
    def _get_ip_address(self):
        """Get the local IP address."""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception:
            return "127.0.0.1"
    
    def _get_os_type(self):
        """Detect the OS type."""
        system = platform.system().lower()
        if system == "darwin":
            return "macos"
        elif system == "windows":
            return "windows"
        else:
            return "linux"  # Default to Linux for other systems
    
    def check_in(self):
        """Check in with the server and get pending deployments."""
        url = f"{self.server_url}/api/client-checkin/"
        data = {
            "hostname": self.hostname,
            "ip_address": self.ip_address,
            "os_type": self.os_type
        }
        
        try:
            response = requests.post(url, json=data, headers=self.headers)
            if response.status_code == 200:
                result = response.json()
                self.client_id = result.get("client_id")
                pending_deployments = result.get("pending_deployments", [])
                
                print(f"Checked in successfully. Client ID: {self.client_id}")
                print(f"Found {len(pending_deployments)} pending deployments")
                
                for deployment in pending_deployments:
                    self.process_deployment(deployment)
                
                return True
            else:
                print(f"Check-in failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"Error during check-in: {str(e)}")
            return False
    
    def process_deployment(self, deployment):
        """Process a pending deployment."""
        deployment_id = deployment.get("id")
        package_name = deployment.get("package_name")
        package_version = deployment.get("package_version")
        
        print(f"Processing deployment {deployment_id}: {package_name} v{package_version}")
        
        # Update deployment status to in_progress
        self.update_deployment_status(deployment_id, "in_progress")
        
        # Simulate installation
        print(f"Installing {package_name} v{package_version}...")
        self._simulate_installation()
        
        # Randomly succeed or fail (90% success rate)
        if random.random() < 0.9:
            status = "completed"
            print(f"Installation of {package_name} v{package_version} completed successfully")
        else:
            status = "failed"
            print(f"Installation of {package_name} v{package_version} failed")
        
        # Update deployment status
        self.update_deployment_status(deployment_id, status)
    
    def update_deployment_status(self, deployment_id, status):
        """Update the status of a deployment."""
        url = f"{self.server_url}/api/update-deployment/{deployment_id}/"
        data = {"status": status}
        
        try:
            response = requests.post(url, json=data, headers=self.headers)
            if response.status_code == 200:
                print(f"Updated deployment {deployment_id} status to: {status}")
                return True
            else:
                print(f"Failed to update deployment status: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"Error updating deployment status: {str(e)}")
            return False
    
    def _simulate_installation(self):
        """Simulate the software installation process."""
        steps = [
            "Downloading package...",
            "Verifying package integrity...",
            "Extracting files...",
            "Running pre-installation checks...",
            "Installing files...",
            "Configuring application...",
            "Running post-installation tasks..."
        ]
        
        for step in steps:
            print(step)
            # Random delay between 0.5 and 2 seconds
            time.sleep(random.uniform(0.5, 2))
            # Show progress
            progress = random.randint(1, 100)
            print(f"Progress: {progress}%")
    
    def run(self):
        """Run the client in a loop."""
        print(f"Starting deployment client for {self.hostname} ({self.ip_address})")
        print(f"Operating System: {self.os_type}")
        print(f"Server URL: {self.server_url}")
        print(f"Check interval: {self.check_interval} seconds")
        
        while True:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"\n[{timestamp}] Checking in with server...")
            
            self.check_in()
            
            print(f"Next check-in in {self.check_interval} seconds...")
            time.sleep(self.check_interval)

def main():
    parser = argparse.ArgumentParser(description="Deployment System Client")
    parser.add_argument("--server", default=DEFAULT_SERVER_URL, help="Server URL")
    parser.add_argument("--interval", type=int, default=DEFAULT_CHECK_INTERVAL, help="Check interval in seconds")
    
    args = parser.parse_args()
    
    client = DeploymentClient(args.server, args.interval)
    try:
        client.run()
    except KeyboardInterrupt:
        print("\nClient stopped by user.")
        sys.exit(0)

if __name__ == "__main__":
    main()