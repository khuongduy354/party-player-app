from django.db.models import query
from django.http import response
from .serializers import CreateRoomSerializer, RoomSerializer
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Room

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset=Room.objects.all()
    serializer_class=RoomSerializer

class CreateRoomView(generics.CreateAPIView):
    serializer_class=CreateRoomSerializer
    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializor=self.serializer_class(data=request.data)
        if serializor.is_valid():
            guest_can_pause=serializor.data.get('guest_can_pause')
            votes_to_skip=serializor.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset: 
               room=queryset[0]
               room.guest_can_pause=guest_can_pause 
               room.votes_to_skip=votes_to_skip
               room.save(update_fields=['guest_can_pause','votes_to_skip'])
               return Response(RoomSerializer(room).data,status=status.HTTP_200_OK)
            else:
                room=Room.objects.create(guest_can_pause=guest_can_pause,votes_to_skip=votes_to_skip,host=host)
                return Response(RoomSerializer(room).data,status=status.HTTP_201_CREATED)
        return Response({'Bad Request':'Invalid data'},status=status.HTTP_400_BAD_REQUEST)

class getRoom(APIView):
    serializer_class= RoomSerializer
    look_up_url_kwarg='roomCode'
    def get(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        roomCode=self.request.GET.get(self.look_up_url_kwarg)   
        if roomCode:
            queryset = Room.objects.filter(code=roomCode)
            if queryset: 
                room = RoomSerializer(queryset[0]).data 
                self.request.session['roomCode']=roomCode
                room['isHost'] = room['host'] == self.request.session.session_key
                return Response(room,status=status.HTTP_200_OK)
            return Response({'Content':'Cant find room'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'content':'bad request'},status=status.HTTP_400_BAD_REQUEST)

# join room but actually CHECK room, if it exist go to room page which used the get-room api 
# which means get-room is join room and joinroom is check if room exist 
class JoinRoom(APIView):
    lookup_url_kwarg='roomCode'
    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        roomCode= request.data.get('roomCode')
        if roomCode:
            queryset= Room.objects.filter(code=roomCode)
            if queryset: 
                return Response(status=status.HTTP_200_OK)
            return Response({'content':'cant find room'},status=status.HTTP_400_BAD_REQUEST)
        return Response({'content':'cant find key'},status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'roomCode': self.request.session.get('roomCode')
        }
        return response.JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    lookup_kwarg='roomCode'
    def post(self,request,format=None):
        if self.lookup_kwarg in self.request.session: 
            self.request.session.pop(self.lookup_kwarg)
            host = self.request.session.session_key
            room = Room.objects.filter(host=host)
            if room: 
                room=room[0]
                room.delete()
        return Response({'Message':'Success'},status=status.HTTP_200_OK)

