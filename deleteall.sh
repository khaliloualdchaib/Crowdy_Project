
kubectl delete pods --all --grace-period=0 --force
kubectl delete deployments --all --grace-period=0 --force
kubectl delete services --all --grace-period=0 --force

docker rmi -f global-head-count:global
docker rmi -f head-counting-service:counter
docker rmi -f image-upload-service:upload
# docker rmi -f specific-head-count:specific
# docker rmi -f dashboard:frontend
docker rmi -f data:forwarder