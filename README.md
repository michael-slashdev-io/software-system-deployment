# Software Deployment System

A simple deployment system for pushing software updates to client machines. It includes a Django backend, React frontend, and a Python client script.

## Components

1. **Django API** – Manages clients, packages, and deployments.
2. **React Dashboard** – Provides an admin interface.
3. **Python Client** – Runs on client machines to process updates.

## Requirements

- Python 3.8+
- Node.js 14+
- PostgreSQL
- Redis

## Setup

### 1. Clone the Repository

```bash
git clone <repository_url>
cd software-deployment-system
```

### 2. Backend Setup

#### Virtual Environment & Dependencies

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in `backend`:

```
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=postgres://user:password@localhost:5432/deployment_db
REDIS_URL=redis://localhost:6379/0
```

#### Database Setup

```bash
createdb deployment_db
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata sample_data.json  # Optional
```

#### Start Services

```bash
python manage.py runserver  # Django API
celery -A deployment_project worker -l info  # Celery worker (separate terminal)
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Configure API in `.env`:

```
REACT_APP_API_URL=http://localhost:8000/api
```

Start the React server:

```bash
npm start
```

### 4. Client Setup

```bash
cd client_script
pip install -r requirements.txt
```

Configure `config.ini`:

```ini
[Server]
api_url=http://localhost:8000/api
check_interval=60

[Client]
name=test-client
os_type=linux
```

Run the script:

```bash
python client.py
```

## Usage

1. Open [Dashboard](http://localhost:3000) and log in.
2. Add software packages under **Packages**.
3. Register clients under **Clients**.
4. Deploy software under **Deployments**.

## API Overview

### Authentication

```
Authorization: Token your_auth_token
```

Retrieve token via `POST /api/token/` with username & password.

### Endpoints

- `GET /api/clients/` – List clients
- `POST /api/clients/` – Register client
- `GET /api/packages/` – List packages
- `POST /api/packages/` – Add package
- `GET /api/deployments/` – List deployments
- `POST /api/deployments/` – Create deployment

## Troubleshooting

- **Database issues** – Ensure PostgreSQL is running.
- **Redis errors** – Verify Redis is active.
- **Client script issues** – Check server URL & network.
