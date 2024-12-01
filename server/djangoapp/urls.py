# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # path for login
    path(route='login', view=views.login_user, name='login'),
    path(route='logout', view=views.logout_request, name='logout'),
    path(route='register', view=views.registration, name='register'),
    path(route='get_cars', view=views.get_cars, name='getcars'),
    # path for dealer reviews view
    path(route='get_dealers', view=views.get_dealerships, name='get_dealers'),
    path(route='get_dealers/<str:state>', view=views.get_dealerships,
         name='get_dealers_by_state'),
    # path for add a review view
    path(route='dealer/<int:dealer_id>', view=views.get_dealer_details,
         name='dealer_details'),
    path(route='reviews/dealer/<int:dealer_id>', view=views.get_dealer_reviews,
         name='dealer_reviews'),
    path(route='reviews/<int:review_id>', view=views.get_review,
         name='review'),
    path(route='add_review', view=views.add_review, name='add_review'),
    path(route='put_review/<int:review_id>', view=views.edit_review,
         name='put_review'),
    path(route='edit_dealer/<int:dealer_id>', view=views.edit_dealer,
         name='edit_dealer'),
    path(route='new_dealer', view=views.new_dealer,
         name='new_dealer'),
    path(route='get_inventory/<int:dealer_id>', view=views.get_inventory,
         name='get_inventory'),
    path(route='full_inventory', view=views.full_inventory,
         name='full_inventory'),
    path(route='chat/', view=views.chat_view, name='chat'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
