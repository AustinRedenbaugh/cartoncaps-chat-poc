import pytest
import asyncio
import time
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_concurrent_requests():
    payloads = [
        {"user_id": 1, "message": "Test 1", "conversation_id": 101},
        {"user_id": 2, "message": "Test 2", "conversation_id": 102},
        {"user_id": 3, "message": "Test 3", "conversation_id": 103},
    ]
    async with AsyncClient(base_url="http://localhost:8000") as ac:
        start = time.perf_counter()

        async def send_request(payload):
            print(f"Sending payload: {payload}")
            async with ac.stream("POST", "/chat/respond", json=payload) as response:
                data = await response.aread()
                print(f"Status: {response.status_code}")
                print(f"Headers: {response.headers}")
                print(f"Raw data: {data}")
                try:
                    print(f"Decoded: {data.decode('utf-8')}")
                except Exception as e:
                    print(f"Decode error: {e}")

        await asyncio.gather(*(send_request(p) for p in payloads))

        elapsed = time.perf_counter() - start
        print(f"Total elapsed time: {elapsed:.2f} seconds")

        # 1.5 seconds is the max time for a single request, should be less than 2.5 seconds if concurrent
        assert elapsed < 2.5, (
            "Requests took too long, likely processed sequentially or with significant delay. "
            f"Elapsed: {elapsed:.2f} seconds"
        )