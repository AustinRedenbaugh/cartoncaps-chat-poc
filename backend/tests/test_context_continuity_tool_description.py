import pytest
from httpx import AsyncClient
import json
import asyncio
import time

@pytest.mark.asyncio
async def test_context_continuity_tool_description():
    payloads = [
        ( {"user_id": 1, "message": "Can I get the referral link?", "conversation_id": 42}, False ),
        ( {"user_id": 2, "message": "Can I get the referral link?", "conversation_id": 43}, True ),
        ( {"user_id": 3, "message": "Can I get the referral link?", "conversation_id": 44}, False ),
        ( {"user_id": 4, "message": "Can I get the referral link?", "conversation_id": 45}, True ),
    ]

    async def send_and_check(payload, expect_referral):
        print(f"Starting request for user_id={payload['user_id']}")
        async with AsyncClient(base_url="http://localhost:8000") as ac:
            async with ac.stream("POST", "/chat/respond", json=payload, timeout=30) as response:
                assert response.status_code == 200
                last_message = None
                # Collect all step messages
                async for line in response.aiter_lines():
                    if line.startswith('data: '):
                        try:
                            data = json.loads(line[len('data: '):])
                            print("Parsed data:", data)
                            if data.get("type") == "step":
                                # Always update last_message with the latest step
                                last_message = data["content"]["message"]
                        except Exception as e:
                            print("JSON decode error:", e)
                # After stream ends, use the last step message
                assert last_message is not None, "No step message received from SSE stream"
                if isinstance(last_message, dict) and "user_id" in last_message:
                    assert last_message["user_id"] == payload["user_id"]
                if expect_referral:
                    expected_link = f"https://cartoncaps.com/route/to/link/{payload['user_id']}"
                    print(f"Expected link: {expected_link}")
                    print(f"Last message: {last_message}")
                    assert expected_link in str(last_message), f"Referral link {expected_link} not found in response: {last_message}"
        print(f"Completed request for user_id={payload['user_id']}")

    results = await asyncio.gather(
        *(send_and_check(payload, expect_referral) for payload, expect_referral in payloads),
        return_exceptions=True
    )
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            print(f"Request {i} raised an exception: {result}")
        else:
            print(f"Request {i} completed successfully.")

