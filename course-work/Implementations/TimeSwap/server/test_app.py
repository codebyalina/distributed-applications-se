import pytest
from app import app, db
from models.user import User
from models.task import Task
import json

@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["WTF_CSRF_ENABLED"] = False
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def register_user(client, username="user1", email="user1@example.com", password="123456"):
    resp = client.post("/auth/register", json={
        "username": username,
        "email": email,
        "password": password
    })
    return resp

def login_user(client, email="user1@example.com", password="123456"):
    resp = client.post("/auth/login", json={
        "email": email,
        "password": password
    })
    assert resp.status_code == 200
    return resp.get_json()["access_token"]

def auth_header(token):
    return {"Authorization": f"Bearer {token}"}

def test_register_and_login(client):
    resp = register_user(client)
    assert resp.status_code == 201
    data = resp.get_json()
    assert "User created successfully!" in data["message"]
    # Login
    token = login_user(client)
    assert isinstance(token, str)

def test_create_task(client):
    register_user(client)
    token = login_user(client)
    task_data = {
        "title": "Test task",
        "description": "Test description",
        "deadline": "2025-06-01T12:00:00",
        "reward": 25.5
    }
    resp = client.post("/tasks/", json=task_data, headers=auth_header(token))
    assert resp.status_code == 201
    data = resp.get_json()
    assert "task_id" in data

def test_get_tasks(client):
    register_user(client)
    token = login_user(client)
    # Create a task
    task_data = {
        "title": "Task1",
        "description": "Desc1",
        "deadline": "2025-06-01T12:00:00",
        "reward": 10
    }
    create_resp = client.post("/tasks/", json=task_data, headers=auth_header(token))
    assert create_resp.status_code == 201, f"Create failed: {create_resp.get_json()}"
    # Get all tasks
    resp = client.get("/tasks/", headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert "tasks" in data
    assert len(data["tasks"]) >= 1

def test_update_and_delete_task(client):
    register_user(client)
    token = login_user(client)
    # Create a task
    task_data = {
        "title": "Task2",
        "description": "Desc2",
        "deadline": "2025-06-01T12:00:00",
        "reward": 42
    }
    create_resp = client.post("/tasks/", json=task_data, headers=auth_header(token))
    assert create_resp.status_code == 201, f"Create failed: {create_resp.get_json()}"
    task_id = create_resp.get_json()["task_id"]
    # Update task
    update_resp = client.put(f"/tasks/{task_id}", json={"title": "Task2-updated"}, headers=auth_header(token))
    assert update_resp.status_code == 200
    # Delete task
    delete_resp = client.delete(f"/tasks/{task_id}", headers=auth_header(token))
    assert delete_resp.status_code == 200
    assert "Task deleted successfully." in delete_resp.get_json().get("message", "")

def test_unauthorized_access(client):
    # Create task without login
    task_data = {
        "title": "Unauthorized",
        "description": "desc",
        "deadline": "2025-06-01T12:00:00",
        "reward": 15
    }
    resp = client.post("/tasks/", json=task_data)
    assert resp.status_code == 401

def test_task_validation(client):
    register_user(client)
    token = login_user(client)
    # Missing title
    bad_data = {
        "title": "",
        "description": "desc",
        "deadline": "2025-06-01T12:00:00",
        "reward": -10  # invalid reward
    }
    resp = client.post("/tasks/", json=bad_data, headers=auth_header(token))
    # Може да върне 400, ако имаш валидация за title и reward
    assert resp.status_code in [400, 422]

def test_claim_and_complete_task(client):
    register_user(client, username="u1", email="u1@mail.com")
    token1 = login_user(client, email="u1@mail.com")
    register_user(client, username="u2", email="u2@mail.com")
    token2 = login_user(client, email="u2@mail.com")

    # User1 създава задача
    task_data = {
        "title": "Test Claim",
        "description": "Valid desc",
        "deadline": "2025-06-01T12:00:00",
        "reward": 20
    }
    resp = client.post("/tasks/", json=task_data, headers=auth_header(token1))
    assert resp.status_code == 201, f"Create failed: {resp.get_json()}"
    task_id = resp.get_json()["task_id"]

    # User2 claim-ва задачата
    resp = client.post(f"/tasks/{task_id}/claim", headers=auth_header(token2))
    assert resp.status_code == 200

    # User2 complete-ва задачата
    resp = client.post(f"/tasks/{task_id}/complete", headers=auth_header(token2))
    assert resp.status_code == 200

    # User1 не може да complete-не (не е claimer)
    resp = client.post(f"/tasks/{task_id}/complete", headers=auth_header(token1))
    assert resp.status_code == 403

def test_search_tasks(client):
    register_user(client)
    token = login_user(client)
    # Create some tasks
    for i in range(3):
        client.post("/tasks/", json={
            "title": f"Task{i}",
            "description": f"Desc{i}",
            "deadline": "2025-06-01T12:00:00",
            "reward": 20 + i
        }, headers=auth_header(token))
    resp = client.get("/tasks/search?reward_min=20&reward_max=21", headers=auth_header(token))
    assert resp.status_code == 200
    data = resp.get_json()
    assert "tasks" in data

