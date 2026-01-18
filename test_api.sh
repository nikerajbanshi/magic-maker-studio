#!/bin/bash

# Test Script for SoundSteps API

echo "Testing SoundSteps API Endpoints..."
echo "===================================="
echo ""

BASE_URL="http://localhost:8000"

# Test 1: Health Check
echo "1. Health Check:"
curl -s "$BASE_URL/health" | python3 -m json.tool
echo -e "\n"

# Test 2: Get Flashcards
echo "2. Get Flashcards:"
curl -s "$BASE_URL/api/cards" | python3 -m json.tool | head -30
echo -e "\n"

# Test 3: Start User Session
echo "3. Start User Session:"
curl -s -X POST "$BASE_URL/api/user/start" \
  -H "Content-Type: application/json" \
  -d '{"name":"TestUser"}' | python3 -m json.tool
echo -e "\n"

# Test 4: Get Sound Out Words
echo "4. Get Sound Out Words:"
curl -s "$BASE_URL/api/soundout" | python3 -m json.tool | head -30
echo -e "\n"

# Test 5: Get Monster Game Questions
echo "5. Get Hungry Monster Questions:"
curl -s "$BASE_URL/api/game/hungry-monster" | python3 -m json.tool | head -30
echo -e "\n"

# Test 6: Get Minimal Pairs
echo "6. Get Minimal Pairs:"
curl -s "$BASE_URL/api/game/minimal-pairs" | python3 -m json.tool | head -30
echo -e "\n"

echo "===================================="
echo "All tests completed!"
