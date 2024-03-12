## Getting Started

First, create virtual environment :

```bash
python3 -m venv venv
```

Then activate environment and install all needed dependencies :

```bash
source venv/bin/activate
pip install -r requirements.txt
```

Synchronizes the database state with the current set of models and migrations :

```bash
python3 manage.py migrate
```

Create admin user :

```bash
python3 manage.py createsuperuser
```

Start server :

```bash
python3 manage.py runserver
```