import json
from pathlib import Path
from threading import Lock
from typing import Dict, Any
from datetime import datetime

DATA_DIR = Path(__file__).parent.parent.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
PROGRESS_FILE = DATA_DIR / "progress.json"
if not PROGRESS_FILE.exists():
    PROGRESS_FILE.write_text("{}")

_lock = Lock()


def _read_store() -> Dict[str, Any]:
    with _lock:
        try:
            return json.loads(PROGRESS_FILE.read_text())
        except Exception:
            return {}


def _write_store(data: Dict[str, Any]):
    with _lock:
        PROGRESS_FILE.write_text(json.dumps(data, indent=2))


def get_user_progress(user_id: str) -> Dict[str, Any]:
    store = _read_store()
    return store.get(user_id, {})


def update_user_progress(user_id: str, payload: Dict[str, Any]):
    store = _read_store()
    user = store.get(user_id, {"user_id": user_id, "mastery": {}, "sessions": [], "last_updated": None})

    # Append session
    session = {
        "timestamp": datetime.utcnow().isoformat(),
        "game": payload.get("game"),
        "score": payload.get("score"),
        "total": payload.get("total"),
        "details": payload.get("details"),
    }
    user.setdefault("sessions", []).append(session)

    # Merge mastery deltas
    mastery_delta = payload.get("mastery_delta") or {}
    if mastery_delta:
        mastery = user.setdefault("mastery", {})
        for k, v in mastery_delta.items():
            # clamp between 0 and 1
            try:
                new = float(v)
            except Exception:
                continue
            mastery[k] = max(0.0, min(1.0, new))

    user["last_updated"] = datetime.utcnow().isoformat()
    store[user_id] = user
    _write_store(store)

    return user
