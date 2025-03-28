import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import google.generativeai as genai
from twilio.rest import Client
from django.conf import settings

# Initialize the Generative Model and Twilio Client
genai.configure(api_key=settings.GENAI_API_KEY)
twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

@csrf_exempt
def ai_first_aid_guide(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            emergency_type = data.get("emergency_type")  

            if not emergency_type:
                return JsonResponse({"error": "Emergency type is required"}, status=400)

            # Initialize the Generative Model
            model = genai.GenerativeModel("gemini-1.5-pro")

            # Generates a first-aid response
            response = model.generate_content(f"Provide first-aid instructions for: {emergency_type}")

            # AI response
            first_aid_guide = (
                response.candidates[0].content.parts[0].text
                if response and response.candidates and response.candidates[0].content.parts
                else "No response available."
            )

            return JsonResponse({"first_aid": first_aid_guide})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def trigger_alert(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            alert_message = data.get("alert", "").strip().upper()
            latitude = data.get("latitude", "").strip()
            longitude = data.get("longitude", "").strip()

            if alert_message != "HELP":
                return JsonResponse({"error": "Invalid input! You can only send 'HELP'."}, status=400)

            # Validate location data
            if not latitude or not longitude:
                return JsonResponse({"error": "Location data is required!"}, status=400)

            # Google Maps live location link
            location_url = f"https://www.google.com/maps?q={latitude},{longitude}"

            # Retrieve emergency contacts
            emergency_contacts_raw = getattr(settings, "TWILIO_PHONE_NUMBER_TO", None)
            if not emergency_contacts_raw:
                return JsonResponse({"error": "No emergency contacts configured."}, status=500)

            emergency_contacts = [contact.strip() for contact in emergency_contacts_raw.split(",") if contact.strip()]
            if not emergency_contacts:
                return JsonResponse({"error": "Emergency contacts list is empty."}, status=500)

            # Send SMS & Call Alert
            for contact in emergency_contacts:
                twilio_client.messages.create(
                    body=f"URGENT: HELP! Immediate assistance required! \n Live Location: {location_url}",
                    from_=settings.TWILIO_PHONE_NUMBER,
                    to=contact
                )
                twilio_client.calls.create(
                    twiml=f'<Response><Say>Emergency Alert! HELP! Assistance required immediately. '
                          f'Check live location: {location_url}</Say></Response>',
                    from_=settings.TWILIO_PHONE_NUMBER,
                    to=contact
                )

            return JsonResponse({"message": "Emergency alert sent successfully with live location!"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)