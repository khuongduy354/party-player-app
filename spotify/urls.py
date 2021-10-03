from django.urls import path
from .views import SpotifyAuth,isSpotifyAuthView,spotify_request_token,GetCurrentSong
urlpatterns = [
    path('get-auth-url',SpotifyAuth.as_view()),
    path('is-spotify-auth',isSpotifyAuthView.as_view()),
    path('redirect',spotify_request_token),
    path('get-song',GetCurrentSong.as_view()),

]
