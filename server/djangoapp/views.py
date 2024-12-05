from django.contrib.auth import logout, get_user_model

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel
from .populate import initiate
from .restapis import get_request, analyze_review_sentiments, \
                    post_review, searchcars_request, put_dealer, \
                    put_review, post_dealer
import openai
import os

# Get an instance of a logger
logger = logging.getLogger(__name__)
User = get_user_model()
openai.api_key = os.getenv('OpenAIAPIKey')


# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        user_type = user.user_type
        dealer_id = user.dealer_id
        data = {"userName": username,
                "status": "Authenticated",
                "user_type": user_type,
                "dealer_id": dealer_id}
        return JsonResponse(data)
    if user is None:
        data = {"userName": username, "error": "Invalid credentials"}
        return JsonResponse(data, status=400)


# Create a `logout_request` view to handle sign out request
def logout_request(request):
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)


# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    # context = {}

    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    dealer_id = data['dealer_id']
    user_type = data['user_type']
    username_exist = False
    # email_exist = False
    try:
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            username_exist = True
    except Exception as e:
        print(f"Error: {e}")
        # If not, simply log this is a new user
        logger.debug("{} is new user".format(username))

    # If it is a new user
    if not username_exist:
        # Create user in auth_user table
        user = User.objects.create_user(username=username,
                                        first_name=first_name,
                                        last_name=last_name,
                                        password=password,
                                        email=email,
                                        dealer_id=dealer_id,
                                        user_type=user_type)
        # Login the user and redirect to list page
        login(request, user)
        data = {"userName": username,
                "status": "Authenticated",
                "user_type": user_type,
                "dealer_id": dealer_id}
        return JsonResponse(data)
    else:
        data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)


def get_cars(request):
    count = CarMake.objects.filter().count()
    print(count)
    if (count == 0):
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({"CarModel": car_model.name,
                     "CarMake": car_model.car_make.name})
    return JsonResponse({"CarModels": cars})


# Update the `get_dealerships` render list of dealerships all by default,
# particular state if state is passed
def get_dealerships(request, state="All"):
    if (state == "All"):
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/"+state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


# Create a `get_dealer_reviews` view to render the reviews of a dealer
def get_dealer_reviews(request, dealer_id):
    if (dealer_id):
        endpoint = "/fetchReviews/dealer/"+str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            print(response)
            if response is not None:
                review_detail['sentiment'] = response['sentiment']
            else:
                review_detail['sentiment'] = ""
        return JsonResponse({"status": 200, "reviews": reviews})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# Create a `get_dealer_reviews` view to render the reviews of a dealer
def get_review(request, review_id):
    if (review_id):
        endpoint = "/fetchReviews/"+str(review_id)
        review = get_request(endpoint)
        if review is not None:
            response = analyze_review_sentiments(review[0]['review'])
            if response is not None:
                review[0]['sentiment'] = response['sentiment']
            else:
                review[0]['sentiment'] = ""
            return JsonResponse({"status": 200, "reviews": review[0]})
        else:
            return JsonResponse({"status": 400, "message": "review not found"})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# Create a `get_dealer_details` view to render the dealer details
def get_dealer_details(request, dealer_id):
    if (dealer_id):
        endpoint = "/fetchDealer/"+str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


# Create a `add_review` view to submit a review
def add_review(request):
    if (request.user.is_anonymous is False):
        data = json.loads(request.body)
        try:
            post_review(data)
            return JsonResponse({"status": 200})
        except Exception:
            return JsonResponse({"status": 401,
                                 "message": "Error in posting review"})
    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})


# Create a `Edit dealer` view to Change dealer details
def edit_dealer(request, dealer_id):
    user_type = request.user.user_type
    if (user_type == 'admin' or
            (user_type == 'dealer' and request.user.dealer_id == dealer_id)):
        if request.method == 'PUT':
            data = json.loads(request.body)
            try:
                response = put_dealer(data, dealer_id)
                return JsonResponse(response, status=200)
            except Exception as err:
                print("Error editing dealer", err)
                return JsonResponse({"message": "Error in Editing Dealer"},
                                    status=401)
        else:
            print("method not allowed")
            return JsonResponse({"message": "Method Not Allowed"}, status=405)
    else:
        return JsonResponse({"status": 403, "message": "No Access"},
                            status=403)


# Create a `New dealer` view to create a dealer
def new_dealer(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            response = post_dealer(data)
            return JsonResponse(response, status=200)
        except Exception as err:
            print("Error creating dealer", err)
            return JsonResponse({"message": "Error in creating Dealer"},
                                status=401)
    else:
        print("method not allowed")
        return JsonResponse({"message": "Method Not Allowed"}, status=405)


# Create a `Edit Review` view to Change Review details
def edit_review(request, review_id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:
            response = put_review(data, review_id)
            return JsonResponse(response)
        except Exception as err:
            print("Error editing Review", err)
            return JsonResponse({"message": "Error in Editing Review"},
                                status=401)
    else:
        print("method not allowed")
        return JsonResponse({"message": "Method Not Allowed"}, status=405)


def get_inventory(request, dealer_id):
    data = request.GET
    if (dealer_id):
        if 'year' in data:
            endpoint = "/carsbyyear/"+str(dealer_id)+"/"+data['year']
        elif 'make' in data:
            endpoint = "/carsbymake/"+str(dealer_id)+"/"+data['make']
        elif 'model' in data:
            endpoint = "/carsbymodel/"+str(dealer_id)+"/"+data['model']
        elif 'mileage' in data:
            endpoint = "/carsbymaxmileage/"+str(dealer_id)+"/"+data['mileage']
        elif 'price' in data:
            endpoint = "/carsbyprice/"+str(dealer_id)+"/"+data['price']
        else:
            endpoint = "/cars/"+str(dealer_id)

        cars = searchcars_request(endpoint)
        return JsonResponse({"status": 200, "cars": cars})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})


def full_inventory(request):
    data = request.GET
    endpoint = "/inventory/"

    try:
        page = data.get('page', 1)  # Default to page 1 if not provided
        limit = data.get('per_page', 10)  # Default to 10 if not provided
        mileage_min = data.get('mileageMin')
        mileage_max = data.get('mileageMax')
        price_min = data.get('priceMin')
        price_max = data.get('priceMax')
        make = data.get('make')
        model = data.get('model')
        year = data.get('year')

        # Build filter parameters to pass to searchcars_request
        filters = {}
        if mileage_min is not None and mileage_max is not None:
            filters['mileageMin'] = mileage_min
            filters['mileageMax'] = mileage_max
        if price_min is not None and price_max is not None:
            filters['priceMin'] = price_min
            filters['priceMax'] = price_max
        if make is not None:
            filters['make'] = make
        if model is not None:
            filters['model'] = model
        if year is not None:
            filters['year'] = year

        cars = searchcars_request(endpoint,
                                  page=str(page),
                                  limit=str(limit),
                                  **filters)
        return JsonResponse({"status": 200,
                             "cars": cars['cars'],
                             "total": cars['totalCars'],
                             "currentPage": cars['currentPage'],
                             "totalPages": cars['totalPages']})
    except Exception as e:
        print("error getting full inventory", e)
        return JsonResponse({"status": 500,
                             "error": "An internal error has occurred!"})


def chat_view(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        user_message = body.get('userMessage', '')
        # Get the user's message from the request data

        if not user_message:
            return JsonResponse({"error": "No message provided"}, status=400)

        try:
            # Make the request to OpenAI's GPT-3/4 API
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system",
                     "content": "You are a helpful assistant."},
                    {
                        "role": "user",
                        "content": user_message
                    }
                ]
            )

            # Get the response from the API
            chat_gpt_message = response.choices[0].message.content

            return JsonResponse({"response": chat_gpt_message})

        except openai.OpenAIError as e:
            print("Error in OpenAI", e)
            return JsonResponse({"status": 500, 
                                 "error": "An internal error has occurred!"})

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def makes_models(request):
    if request.method == 'GET':
        endpoint = "/makes_models/"
        try:
            res = searchcars_request(endpoint)
            return JsonResponse({"status": 200, "makes_models": res})
        except Exception as e:
            print("error getting makes/models", e)
            return JsonResponse({"status": 500,
                                 "error": "An internal error has occurred!"})
    else:
        print("method not allowed")
        return JsonResponse({"message": "Method Not Allowed"}, status=405)
