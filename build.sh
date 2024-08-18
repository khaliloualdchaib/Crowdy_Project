#!/bin/bash

# Build and tag the Docker images
cd backend/database-service || exit 1
docker build --tag data:base .
cd -

cd backend/head-counting-service || exit 1
docker build --tag head-counting-service:counter .
cd -

cd backend/image-upload-service || exit 1
docker build --tag image-upload-service:upload .
cd -

cd frontend || exit 1
docker build --tag dashboard:frontend .
cd -

# Apply the Kubernetes manifests
cd kubernetes || exit 1
kubectl apply -f frontend-kube/
kubectl apply -f database-kube/
kubectl apply -f head-count-kube/
kubectl apply -f image-upload-kube/
kubectl get deployment metrics-server -n kube-system -o yaml > metrics-server.yaml
kubectl apply -f metrics-server.yaml

# Return to the original directory
cd -
