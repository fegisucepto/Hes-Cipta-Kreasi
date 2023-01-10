docker-compose -f docker-compose-v2.yml build
docker-compose -f docker-compose-v2.yml down
docker-compose -f docker-compose-v2.yml up -d
docker exec -i mt-tracker-backend-v2 npm run migrate

