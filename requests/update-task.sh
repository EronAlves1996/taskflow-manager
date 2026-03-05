BODY=$(cat <<JSON
    {
        "assignee": 15
    }
JSON
)

curl --data "$BODY" \
    -X 'PATCH' \
    -H 'Content-type: application/json' \
    http://localhost:3000/tasks/1

