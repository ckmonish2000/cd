# mysql db
# redis
start-db:
	docker run --name mysql-cd --network=project-cd -v ${PWD}/datadir:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=7596 -e MYSQL_DATABASE=cd -d mysql
	docker run --name redis-cd --network=project-cd  -v ${PWD}/data:/data -d redis:alpine

build-node-image:
	docker build -t project-cd:v1 .

#  run container
run-node-container:
	docker run --name project-cd --network=project-cd -p 3000:3000 -p 4000:9100 project-cd:v1 