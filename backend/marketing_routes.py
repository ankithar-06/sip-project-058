import os
import datetime
import re
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional

from database import (
    marketing_collection,
    businesses_collection,
    analytics_collection,
    format_doc,
)
from auth import get_current_user
from schemas import MarketingGenerateRequest, MarketingContentResponse

router = APIRouter(prefix="/api/marketing", tags=["AI Marketing Assistant"])


def generate_smart_marketing_content(
    product_name: str,
    product_description: str,
    target_audience: str,
    objective: str,
    business_name: str = "Our Business",
    city: str = "India",
) -> dict:
    """
    Generates high-converting marketing copy for informal MSMEs.
    If GEMINI_API_KEY is configured, calls the Gemini API;
    otherwise generates highly targeted, tailored industry copy templates.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key.strip():
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
You are an expert marketing strategist assisting an Indian MSME (Micro, Small and Medium Enterprise).
Business Name: {business_name}
City/Region: {city}
Product Name: {product_name}
Description: {product_description}
Target Audience: {target_audience}
Marketing Objective: {objective}

Generate a JSON response with:
1. "captions": array of 4 distinct social media captions (Instagram, WhatsApp, LinkedIn, Facebook)
2. "slogans": array of 4 catchy business slogans/taglines
3. "promotional_messages": array of 3 SMS/WhatsApp broadcast offers
4. "hashtags": array of 10 relevant hashtags including hyperlocal and MSME tags
5. "ad_copy": dictionary with "headline", "hook", "value_proposition", "call_to_action"
Return ONLY valid JSON.
"""
            response = model.generate_content(prompt)
            # Simple JSON extraction
            text = response.text.strip()
            if text.startswith("```"):
                text = re.sub(r"^```json|^```|```$", "", text, flags=re.MULTILINE).strip()
            import json
            data = json.loads(text)
            return data
        except Exception as e:
            print(f"Gemini API generation error, falling back to smart engine: {e}")

    # High-quality smart template engine
    p_name = product_name.strip()
    p_desc = product_description.strip()
    clean_tag = re.sub(r'[^a-zA-Z0-9]', '', p_name)

    captions = [
        f"✨ Discover the authentic quality of {p_name}! Handcrafted with care for {target_audience}. {p_desc} Supporting local MSMEs has never felt this rewarding! DM us or visit us today to order.",
        f"🚀 Looking for premium {p_name}? Designed specifically for {target_audience} who value durability and craftsmanship. Get yours directly from {business_name} in {city}!",
        f"💡 Quality meets affordability! Introducing {p_name}: {p_desc}. Perfect for {target_audience}. Share with someone who needs this!",
        f"🌟 Empower your local community while getting the best {p_name}. Built to help you achieve {objective.lower()}. Connect with {business_name} today!"
    ]

    slogans = [
        f"{p_name} — Quality You Can Trust, Value You Deserve.",
        f"Empowering {target_audience} with Authentic {p_name}.",
        f"Crafted Locally in {city}, Loved Everywhere.",
        f"Smart Solutions for {target_audience} — Choose {business_name}."
    ]

    promotional_messages = [
        f"📢 SPECIAL OFFER from {business_name}: Order {p_name} this week and get exclusive inaugural savings! Contact us now: Limited stock available.",
        f"⚡ WhatsApp Exclusive: Upgrade your everyday experience with authentic {p_name}. Designed for {target_audience}. Reply 'INTERESTED' for instant catalog!",
        f"🎁 MSME Festival Special: Support local business & enjoy best-in-market pricing on {p_name}. Visit our store or order online today!"
    ]

    hashtags = [
        f"#{clean_tag}",
        "#VocalForLocal",
        "#IndianMSME",
        "#SupportSmallBusiness",
        f"#{clean_tag}Online",
        f"#{city.replace(' ', '')}MSME",
        "#AtmanirbharBharat",
        "#MakeInIndia",
        "#SmallBusinessIndia",
        "#QualityCraftsmanship"
    ]

    ad_copy = {
        "headline": f"Experience Superior Quality with {p_name}",
        "hook": f"Are you tired of low-quality alternatives? Here is why {target_audience} choose {business_name}.",
        "value_proposition": f"{p_desc}. Direct from local manufacturer with verified quality assurance.",
        "call_to_action": f"Contact {business_name} today to get special pricing and fast delivery!"
    }

    return {
        "captions": captions,
        "slogans": slogans,
        "promotional_messages": promotional_messages,
        "hashtags": hashtags,
        "ad_copy": ad_copy,
    }


@router.post("/generate", response_model=MarketingContentResponse)
def generate_marketing_content(
    payload: MarketingGenerateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["id"]
    business = businesses_collection.find_one({"owner_id": user_id})

    business_name = business.get("name", "Local MSME") if business else "Our Business"
    city = business.get("city", "India") if business else "India"
    business_id = str(business["_id"]) if business else None

    content = generate_smart_marketing_content(
        product_name=payload.product_name,
        product_description=payload.product_description,
        target_audience=payload.target_audience,
        objective=payload.marketing_objective,
        business_name=business_name,
        city=city,
    )

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    record = {
        "business_id": business_id,
        "owner_id": user_id,
        "product_name": payload.product_name,
        "product_description": payload.product_description,
        "target_audience": payload.target_audience,
        "objective": payload.marketing_objective,
        "captions": content["captions"],
        "slogans": content["slogans"],
        "promotional_messages": content["promotional_messages"],
        "hashtags": content["hashtags"],
        "ad_copy": content["ad_copy"],
        "created_at": now,
    }

    result = marketing_collection.insert_one(record)
    content["id"] = str(result.inserted_id)
    content["business_id"] = business_id
    content["product_name"] = payload.product_name
    content["created_at"] = now

    # Record marketing generation in analytics
    if business_id:
        analytics_collection.update_one(
            {"business_id": business_id},
            {
                "$inc": {"marketing_generations": 1},
                "$push": {
                    "activity_log": {
                        "$each": [{
                            "action": "Marketing Generated",
                            "timestamp": now,
                            "details": f"Generated promotional copy for '{payload.product_name}'"
                        }],
                        "$slice": -50
                    }
                }
            },
            upsert=True,
        )

    return content


@router.get("/history", response_model=List[MarketingContentResponse])
def get_marketing_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    cursor = marketing_collection.find({"owner_id": user_id}).sort("created_at", -1).limit(20)
    return [format_doc(doc) for doc in cursor]
