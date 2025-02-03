from django.contrib import admin

# Register your models here.
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'age', 'working', 'sex')
    search_fields = ('name', 'email')
    list_filter = ('working', 'sex')