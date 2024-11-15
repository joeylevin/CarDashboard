# Car Dashboard Project
## Instructions to run locally
### Frontend  
cd server/frontend  
npm install  
npm run build  

### Backend 1
cd server/database  
docker build . -t nodeapp  
docker-compose up api

### Backend 2
cd server/carsInventory  
docker build . -t nodeapp  
docker-compose up  

### Sentiment Analyzer Deploy
*Run in Coursera workspace. Project will still work if not deployed*  
Start Cloud code engine project  
open Cloud Engine CLI  
cd server/djangoapp/microservices  
docker build . -t us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer  
docker push us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer  
ibmcloud ce application create --name sentianalyzer --image us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer --registry-secret icr-secret --port 5000  

## For deploying to run remotely
### build and push image
MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)  
echo $MY_NAMESPACE  
docker build -t us.icr.io/$MY_NAMESPACE/dealership .  
docker push us.icr.io/$MY_NAMESPACE/dealership  

### create deployment
kubectl apply -f deployment.yaml  

## Common issues
*no such table: djangoapp_carmake*  
to fix:  
rm server/djangoapp/__init__.py server/db.sqlite3   
rm -r server/djangoapp/__pycache__  
apply migrations from runServer.txt  
python3 manage.py makemigrations  
python3 manage.py migrate --run-syncdb  

*Car list empty*  
To initialize car list mock data  
go to : /djangoapp/get_cars  

*Make sure correct links are being used if it isn't running on localhost*  
Update links in server/djangoapp/.env  
and server/djangoproj/settings.py for ALLOWED_HOSTS and CSRF_TRUSTED_ORIGINS
