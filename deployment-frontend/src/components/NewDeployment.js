import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const NewDeployment = () => {
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    client: '',
    package: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch clients
        const clientsResponse = await apiService.getClients({ status: 'online' });
        setClients(clientsResponse.data.results || []);
        
        // Fetch packages
        const packagesResponse = await apiService.getPackages();
        setPackages(packagesResponse.data.results || []);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.client || !formData.package) {
      setError('Please select both a client and a package');
      return;
    }
    
    try {
      setSubmitting(true);
      
      await apiService.createDeployment({
        client: formData.client,
        package: formData.package,
      });
      
      navigate('/deployments');
    } catch (error) {
      console.error('Error creating deployment:', error);
      setError('Failed to create deployment');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Create New Deployment</h2>
      
      <Card>
        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Client</Form.Label>
              <Form.Select
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.hostname} ({client.ip_address})
                  </option>
                ))}
              </Form.Select>
              {clients.length === 0 && (
                <Form.Text className="text-muted">
                  No online clients available. Please make sure at least one client is online.
                </Form.Text>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Select Package</Form.Label>
              <Form.Select
                name="package"
                value={formData.package}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Package --</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} v{pkg.version}
                  </option>
                ))}
              </Form.Select>
              {packages.length === 0 && (
                <Form.Text className="text-muted">
                  No packages available. Please add a package first.
                </Form.Text>
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                className="me-2"
                onClick={() => navigate('/deployments')}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitting || clients.length === 0 || packages.length === 0}
              >
                {submitting ? 'Creating...' : 'Create Deployment'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewDeployment;