#!/bin/bash

cd backend/global-head-count || exit 1
docker build --tag global-head-count:global .
cd -

cd backend/head-counting-service || exit 1
docker build --tag head-counting-service:counter .
cd -

cd backend/image-upload-service || exit 1
docker build --tag image-upload-service:upload .
cd -

cd backend/specific-head-count || exit 1
docker build --tag specific-head-count:specific .
cd -

cd frontend || exit 1
docker build --tag dashboard:frontend .
cd -

cd kubernetes || exit 1
kubectl apply -f frontend-kube/
kubectl apply -f global-head-count-kube/
kubectl apply -f specific-head-count-kube/
kubectl apply -f head-count-kube/
kubectl apply -f image-upload-kube/
