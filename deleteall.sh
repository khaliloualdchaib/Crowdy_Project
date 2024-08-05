
kubectl delete pods --all --grace-period=0 --force
kubectl delete deployments --all --grace-period=0 --force
kubectl delete services --all --grace-period=0 --force

docker rmi -f data:base
docker rmi -f head-counting-service:counter
docker rmi -f image-upload-service:upload
docker rmi -f dashboard:frontend
docker rmi -f data:forwarder