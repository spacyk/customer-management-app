from django.db import models

class Customer(models.Model):
   first_name = models.CharField(max_length=30)
   last_name = models.CharField(max_length=30)
   email = models.EmailField(max_length=70,blank=True)
