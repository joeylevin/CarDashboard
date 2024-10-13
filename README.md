# coding-project-template
Frontend
cd server/frontend
npm install
npm run build

Backend
cd server/database
docker build . -t nodeapp
docker-compose up

Git
git config --global user.email levinjoey@gmail.com
git config --global user.name Joey

Sentiment Analyzer Deploy
Start Cloud code engine project
open Cloud Engine CLI
cd server/djangoapp/microservices
docker build . -t us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer
docker push us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer
ibmcloud ce application create --name sentianalyzer --image us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer --registry-secret icr-secret --port 5000
