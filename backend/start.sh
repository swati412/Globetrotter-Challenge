#!/bin/bash
python -m uvicorn simple_app:app --host 0.0.0.0 --port $PORT 