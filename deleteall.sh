
kubectl delete pods --all --grace-period=0 --force
kubectl delete deployments --all --grace-period=0 --force
kubectl delete services --all --grace-period=0 --force
kubectl delete hpa --all --grace-period=0 --force
cd kubernetes || exit 1
rm metrics-server.yaml
docker rmi -f data:base
docker rmi -f head-counting-service:counter
docker rmi -f image-upload-service:upload
docker rmi -f dashboard:frontend