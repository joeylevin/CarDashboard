# restapis.py
# This script provides functions to interact with several backend services
# via REST APIs.

import requests
import os
from dotenv import load_dotenv
from django.http import JsonResponse

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")
searchcars_url = os.getenv(
    'searchcars_url',
    default="http://localhost:3050/")


def get_request(endpoint, **kwargs):
    params = ""
    if (kwargs):
        for key, value in kwargs.items():
            params = params+key+"="+value+"&"

    request_url = backend_url+endpoint+"?"+params

    print("GET from {} ".format(request_url))
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as e:
        # If any error occurs
        print(f"Network exception occurred: {e}")


def searchcars_request(endpoint, **kwargs):
    params = ""
    if (kwargs):
        for key, value in kwargs.items():
            params = params+key + "=" + value + "&"

    request_url = searchcars_url+endpoint+"?"+params

    print("GET from {} ".format(request_url))
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
    finally:
        print("GET request call complete!")


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url+"analyze/"+text
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred for Sentiment")


def put_dealer(data, dealer_id):
    request_url = backend_url+"/update_dealer/"+str(dealer_id)
    try:
        response = requests.put(request_url, data)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed with status code {response.status_code}")
            return {"error": "Failed to update dealer"}
    except Exception as e:
        print(f"Network exception occurred: {e}")
        return {"error": "Network exception"}


def post_dealer(data):
    request_url = backend_url+"/new_dealer"
    try:
        response = requests.post(request_url, json=data)
        print(response.json())
        return response.json()
    except Exception as e:
        print(f"Network exception occurred: {e}")


def post_review(data_dict):
    request_url = backend_url+"/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        print(response.json())
        return response.json()
    except Exception as e:
        print(f"Network exception occurred: {e}")


def put_review(data, review_id):
    request_url = backend_url+"/edit_review/"+str(review_id)
    try:
        response = requests.put(request_url, data)
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 403:
            return JsonResponse({"message": "Forbidden: You do not have \
                                permission to edit this review"},
                                status=403)
        elif response.status_code == 404:
            return JsonResponse({"message": "Review not found"},
                                status=404)
        else:
            print(f"Failed with status code {response.status_code}")
            return JsonResponse({"message":
                                "An error occurred editing the review"},
                                status=500)
    except Exception as e:
        print(f"Network exception occurred: {e}")
        return {"error": "Network exception"}
