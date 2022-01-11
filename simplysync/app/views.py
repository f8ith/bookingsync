import requests
from rest_framework.views import APIView
from rest_framework.response import Response

class SimplyBookCallback(APIView):
    """
    Consumes Simplybook callback url.
    """

    def post(self, request, format=None):
        print(request.data)
        return Response(request.data)

