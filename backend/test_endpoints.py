import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def make_request(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    
    req_data = None
    if data:
        req_data = json.dumps(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            return response.status, json.loads(res_data) if res_data else {}
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        print(e.read().decode("utf-8"))
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"URL Error (Is server running?): {e.reason}")
        sys.exit(1)

def run_integration_tests():
    print("=== STARTING HTTP ENDPOINT INTEGRATION TESTS ===")

    # 1. Test Simulation Endpoint
    print("\nTesting POST /api/simulate (Single)...")
    sim_input = {
        "decisionMode": "single",
        "params": {
            "social": "extrovert",
            "risk": "low",
            "priority": "balance",
            "decision": "Quit FAANG corporate office job to start a bakery"
        }
    }
    status, sim_data = make_request("/api/simulate", "POST", sim_input)
    assert status == 200
    assert "single" in sim_data
    print("[OK] /api/simulate returns successful simulation payload.")

    # 2. Test Create Decision Endpoint
    print("\nTesting POST /api/decisions...")
    test_record = {
        "id": "ff_test_999",
        "title": "Corporate to Bakery Transition",
        "mode": "single",
        "createdAt": "2026-07-16T12:00:00Z",
        "input": sim_input["params"],
        "results": sim_data,
        "finalVerdict": {
            "verdictTitle": "Recommendation: Slow transition",
            "verdictBody": "Proceed carefully with your risk tolerance",
            "confidence": 85,
            "successProb": 60,
            "happiness": 70,
            "riskLevel": "Low"
        },
        "shareable": True
    }
    status, save_data = make_request("/api/decisions", "POST", test_record)
    assert status == 200
    assert save_data["id"] == "ff_test_999"
    print("[OK] POST /api/decisions successfully stored the record.")

    # 3. Test List Decisions Endpoint
    print("\nTesting GET /api/decisions...")
    status, list_data = make_request("/api/decisions")
    assert status == 200
    assert isinstance(list_data, list)
    assert len(list_data) >= 1
    assert any(d["id"] == "ff_test_999" for d in list_data)
    print(f"[OK] GET /api/decisions successfully returns list of {len(list_data)} records including our test ID.")

    # 4. Test Get Single Decision Endpoint
    print("\nTesting GET /api/decisions/ff_test_999...")
    status, single_data = make_request("/api/decisions/ff_test_999")
    assert status == 200
    assert single_data["title"] == "Corporate to Bakery Transition"
    print("[OK] GET /api/decisions/{id} returns the correct record.")

    # 5. Test Delete Decision Endpoint
    print("\nTesting DELETE /api/decisions/ff_test_999...")
    status, del_res = make_request("/api/decisions/ff_test_999", "DELETE")
    assert status == 200
    assert del_res["status"] == "success"
    print("[OK] DELETE /api/decisions/{id} successfully deleted the record.")

    # 6. Verify Deletion
    print("\nTesting GET /api/decisions/ff_test_999 (should fail)...")
    url = f"{BASE_URL}/api/decisions/ff_test_999"
    try:
        urllib.request.urlopen(url)
        print("FAIL: Expected 404 but got 200!")
        sys.exit(1)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("[OK] Verified GET /api/decisions/{id} returns 404 after deletion.")
        else:
            print(f"FAIL: Expected 404 but got {e.code}")
            sys.exit(1)

    print("\nAll HTTP integration tests completed successfully!")

if __name__ == "__main__":
    run_integration_tests()
