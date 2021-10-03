
# Create your views here.
from django.http.response import  HttpResponseRedirect

from spotify.models import SpotifyToken
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from backend.models import Room
from rest_framework.response import Response
from .utils import isSpotifyAuth,update_or_create_user_tokens,send_spotify_api_request

class SpotifyAuth(APIView):
    def get(self,request,format=None):
        scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url=Request('GET','https://accounts.spotify.com/authorize',params={
            'scope':scope,
            'response_type':'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url
        return Response({'url':url},status=status.HTTP_200_OK)


def spotify_request_token(request):
    code= request.GET.get('code')
    response=post('https://accounts.spotify.com/api/token',data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    if not request.session.exists(request.session.session_key):
        request.session.create()
    session_id=request.session.session_key
    print('session in django')
    print(session_id)
    update_or_create_user_tokens(session_id=session_id, access_token=access_token,token_type=token_type,refresh_token=refresh_token,expires_in=expires_in) 
    return HttpResponseRedirect('http://localhost:3000/')

class isSpotifyAuthView(APIView):
    def get(self,request,format=None):
        print('session in tokens')

        for token in SpotifyToken.objects.all():
            print(token.user)
        print('session when check auth')
        print(self.request.session.session_key)
        isAuth=isSpotifyAuth(self.request.session.session_key)
        print('authed?')
        print(isAuth)
        return Response({'status':isAuth},status=status.HTTP_200_OK)
            

class GetCurrentSong(APIView):
    def get(self,request,format=None):
        roomCode=self.request.session.get('roomCode')
        room = Room.objects.filter(code=roomCode)
        if room:
            room=room[0]
        else:
            pass #cant find room
        host=room.host
        endpoint = "player/currently-playing"
        response=send_spotify_api_request(host=host,endpoint=endpoint)
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')
        artists=item.get('artists')
        artists_string=','.join([data.get('name') for (key,data) in enumerate(artists)])


        song = {
            'artists_string':artists_string,
            'title': item.get('name'),
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id
        }


        return Response(song,status=status.HTTP_200_OK)