!#/bin/sh
LABEL=conversion_tools_web
docker build -t $LABEL -f Dockerfile . &&  docker run -d -p 5001:8080 $LABEL

