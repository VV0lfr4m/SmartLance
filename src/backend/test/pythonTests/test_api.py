import requests
import pytest
from assertpy import assert_that
import uuid

# create payload
# call post
# get response

BASE_URL = "http://localhost:8080"


@pytest.fixture
def user_payload():
    unique_id = f"0x{uuid.uuid4().hex[:8]}"
    return {
        "id": unique_id,
        "username": "test",
        "bio": "test"
    }


def test_register_user(user_payload):
    json_response = requests.post(f"{BASE_URL}/users", json=user_payload)
    expected_response = {
        "id": user_payload["id"],
        "username": user_payload["username"],
        "bio": "link_generated",
        "bioFull": user_payload["bio"]
    }

    print("Response JSON:", json_response.json())
    assert_that(json_response.json()).is_equal_to(expected_response)

def test_register_user_fail():
    payload = {
        "id": "0x123",
        "username": "test",
        "bio": "link_generated",
        "bioFull": "test"
    }
    response = requests.post(f"{BASE_URL}/users", json=payload)

    print("Response JSON:", response)
    assert_that(response.status_code).is_equal_to(500)
    assert_that(response.json()["error"]).is_equal_to("Validation Error")
    assert_that(response.json()["message"]).is_equal_to("User already registered")


def test_get_user_by_address():
    address = "0x123"
    expected_content = {
        "id": address,
        "username": "Alice",
        "bio": "Alice bio",
        "bioFull": None
    }
    response = requests.get(f"{BASE_URL}/users/{address}")
    print("Response JSON:", response.json())
    assert response.status_code == 200
    assert response.json() == expected_content


if __name__ == "__main__":
    pytest.main()
