!#/usr/bin/bash
LABEL=conversion_tools_web
docker rm -f $LABEL
docker build -t $LABEL -f Dockerfile . &&  docker run -d -p 5001:8080 --name $LABEL $LABEL

