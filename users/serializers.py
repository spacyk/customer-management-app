from django.contrib.auth.models import User, Group
from rest_framework import serializers
from users.models import Customer


class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'first_name', 'last_name', 'email')
