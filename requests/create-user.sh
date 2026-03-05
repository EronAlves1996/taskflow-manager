BODY=$(cat <<JSON
    {
      "name": "José Marimngolo"
    }
JSON
)

curl --data "$BODY" \
    -H 'Content-type: application/json' \
    http://localhost:3000/users

