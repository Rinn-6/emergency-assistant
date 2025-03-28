"""
ASGI config for my_app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from emergency.consumers import AlertConsumer
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_app.settings')

application = ProtocolTypeRouter({
    "websocket": URLRouter([
        path("ws/alerts/", AlertConsumer.as_asgi()),
    ])
})