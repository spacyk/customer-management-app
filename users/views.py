from django.shortcuts import render, redirect, get_object_or_404
from django.http import Http404

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.renderers import TemplateHTMLRenderer

from django.forms import ModelForm
from users.models import Customer
from users.serializers import CustomerSerializer



##########################
# Simple output views
def customers(request):
    return render(request, "users/customers.html")

def about(request):
    return render(request, "users/about.html")



# Function view for customer create
class CustomerForm(ModelForm):
    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'email']

def customer_create(request, template_name='users/create_form.html'):
    form = CustomerForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('/show')
    return render(request, template_name, {'form':form})


# REST classbased views
class CustomerList(APIView):
    """
    List all customers, or add new customer.
    """
    permission_classes = (AllowAny,)
    def get(self, request, format=None):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)


class CustomerDetail(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'users/customer_form.html'

    """
    Retrieve, update or delete a snippet instance.
    """
    permission_classes = (AllowAny,)
    def get_object(self, pk):
        try:
            return Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer)
        return Response({'serializer': serializer, 'customer': customer})

    def post(self, request, pk, format=None):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return redirect('/show')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        customer = self.get_object(pk)
        customer.delete()
        return redirect('/show')
