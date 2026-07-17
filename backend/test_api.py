from backend.engine import run_full_simulation
import json

def run_tests():
    print("=== RUNNING ENGINE UNIT TESTS ===")
    
    test_params = {
        "social": "introvert",
        "risk": "high",
        "priority": "passion",
        "decision": "Quit my corporate job to open a boutique bakery",
        "decisionA": "Quit my corporate job to open a boutique bakery",
        "decisionB": "Stay at my corporate job and bake on weekends"
    }

    # 1. Test Single Mode
    print("\nTesting Single Mode simulation...")
    single_result = run_full_simulation("single", test_params)
    assert "single" in single_result
    single_data = single_result["single"]
    
    assert "path" in single_data
    assert single_data["path"] == "CREATIVE"  # "bakery" should trigger CREATIVE path
    assert "debate" in single_data
    assert "messages" in single_data["debate"]
    assert len(single_data["debate"]["messages"]) == 4
    assert "verdict" in single_data["debate"]
    assert "timeline" in single_data
    assert "best" in single_data["timeline"]
    assert "average" in single_data["timeline"]
    assert "worst" in single_data["timeline"]
    assert "regret" in single_data
    assert "score" in single_data["regret"]
    assert "story" in single_data
    print("[OK] Single Mode simulation check passed!")

    # 2. Test Comparative Mode
    print("\nTesting Comparative Mode simulation...")
    comparative_result = run_full_simulation("multiple", test_params)
    assert "optionA" in comparative_result
    assert "optionB" in comparative_result
    
    assert comparative_result["optionA"]["path"] == "CREATIVE"
    assert comparative_result["optionB"]["path"] == "TECH"  # "corporate job" should trigger TECH path
    print("[OK] Comparative Mode simulation check passed!")
    
    print("\nAll unit tests passed successfully!")

if __name__ == "__main__":
    run_tests()
