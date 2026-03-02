BODY=$(cat <<JSON
    {
      "title": "teste",
      "status": "pending",
      "priority": "low"
    }
JSON
)

curl --data "$BODY" \
    -H 'Content-type: application/json' \
    http://localhost:3000/task

