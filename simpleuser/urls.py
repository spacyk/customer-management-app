
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework.urlpatterns import format_suffix_patterns

from users import views



urlpatterns = [
    url(r'^$', views.about, name='about'),
    url(r'^show$', views.customers, name='customers'),
    url(r'^add$', views.customer_create, name='add'),

    # REST API calls
    url(r'^customer$', views.CustomerList.as_view()),
    url(r'^customer/(?P<pk>[0-9]+)/$', views.CustomerDetail.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
