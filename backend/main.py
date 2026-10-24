import os
import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Supabase init error: {e}")

app = FastAPI(title="Star Line Travels Enterprise API", version="2.0")

# Enable CORS for Frontend Access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- SCHEMAS -----------------
class LeadCreate(BaseModel):
    name: Optional[str] = "Customer"
    phone: str
    pickup: Optional[str] = ""
    drop: Optional[str] = ""
    pickup_city: Optional[str] = ""
    drop_city: Optional[str] = ""
    trip_type: Optional[str] = "round-trip"
    travel_date: Optional[str] = None
    car_type: Optional[str] = "Sedan (Dzire / Aura)"
    fare: Optional[float] = 0.0
    estimated_fare: Optional[float] = 0.0
    type: Optional[str] = "Round-Trip"
    date: Optional[str] = "Flexible"

class DriverRegister(BaseModel):
    driver_name: str
    phone: str
    car_model: str
    car_year: Optional[int] = 2024
    commercial_number: Optional[str] = ""
    base_location: str
    preferred_routes: Optional[str] = "All Routes"

# ----------------- 1. HEALTH CHECK -----------------
@app.get("/")
def health_check():
    return {
        "status": "online",
        "business": "Star Line Travels",
        "hotline": "+91 88821 91825",
        "database": "connected" if supabase else "mock_mode"
    }

# ----------------- 2. VISITOR ANALYTICS -----------------
@app.post("/api/track-visit")
async def track_visit(request: Request):
    city = request.headers.get("x-visitor-city", "Delhi NCR")
    ip = request.client.host if request.client else "127.0.0.1"
    if supabase:
        try:
            supabase.table("site_analytics").insert({"visitor_ip": ip, "city": city}).execute()
        except Exception:
            pass
    return {"status": "logged"}

@app.get("/api/analytics-stats")
def get_analytics():
    if not supabase:
        return {
            "total": 142,
            "today": 28,
            "week": 104,
            "month": 360,
            "year": 2980,
            "cities": [
                {"city": "Delhi NCR", "count": 185},
                {"city": "Noida", "count": 42},
                {"city": "Gurgaon", "count": 38}
            ]
        }
    
    try:
        res = supabase.table("site_analytics").select("*").order("visited_at", desc=True).limit(2000).execute()
        data = res.data or []
        total = len(data)
        
        now = datetime.datetime.now(datetime.timezone.utc)
        today_count = sum(1 for d in data if (now - datetime.datetime.fromisoformat(d['visited_at'])).days == 0)
        week_count = sum(1 for d in data if (now - datetime.datetime.fromisoformat(d['visited_at'])).days <= 7)
        month_count = sum(1 for d in data if (now - datetime.datetime.fromisoformat(d['visited_at'])).days <= 30)
        year_count = sum(1 for d in data if (now - datetime.datetime.fromisoformat(d['visited_at'])).days <= 365)
        
        city_map = {}
        for d in data:
            c = d.get('city') or 'Delhi NCR'
            city_map[c] = city_map.get(c, 0) + 1
        
        city_list = [{"city": k, "count": v} for k, v in sorted(city_map.items(), key=lambda x: x[1], reverse=True)[:6]]
        
        return {
            "total": total,
            "today": today_count,
            "week": week_count,
            "month": month_count,
            "year": year_count,
            "cities": city_list
        }
    except Exception as e:
        return {"total": 0, "today": 0, "week": 0, "month": 0, "year": 0, "cities": [], "error": str(e)}

# ----------------- 3. APP SETTINGS & LIVE RATES -----------------
@app.get("/api/settings")
def get_settings():
    if not supabase:
        return {}
    try:
        res = supabase.table("app_settings").select("*").eq("id", 1).execute()
        return res.data[0] if res.data else {}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/settings")
def update_settings(payload: Dict[str, Any]):
    if not supabase:
        return {"status": "mock_saved", "data": payload}
    try:
        res = supabase.table("app_settings").update(payload).eq("id", 1).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------- 4. TOURS & ITINERARY CRUD -----------------
@app.get("/api/tours")
def get_tours():
    if not supabase:
        return []
    try:
        res = supabase.table("tours_catalog").select("*").execute()
        return res.data or []
    except Exception as e:
        return []

@app.post("/api/tours")
def save_tour(tour: Dict[str, Any]):
    if not supabase:
        return {"status": "mock_saved", "data": tour}
    try:
        res = supabase.table("tours_catalog").upsert(tour).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/tours/{tour_id}")
def delete_tour(tour_id: str):
    if not supabase:
        return {"status": "mock_deleted"}
    try:
        supabase.table("tours_catalog").delete().eq("id", tour_id).execute()
        return {"status": "deleted", "id": tour_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------- 5. CUSTOMER INQUIRIES & LEADS -----------------
@app.post("/api/leads")
def save_lead(lead: LeadCreate):
    if not supabase:
        return {"status": "mock_saved", "data": lead.dict()}
    try:
        # Map fields flexibly to match database columns
        data = lead.dict()
        if not data.get("pickup") and data.get("pickup_city"):
            data["pickup"] = data["pickup_city"]
        if not data.get("drop") and data.get("drop_city"):
            data["drop"] = data["drop_city"]
        if not data.get("fare") and data.get("estimated_fare"):
            data["fare"] = data["estimated_fare"]

        res = supabase.table("leads").insert(data).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leads")
def get_leads():
    if not supabase:
        return []
    try:
        res = supabase.table("leads").select("*").order("created_at", desc=True).limit(50).execute()
        return res.data or []
    except Exception as e:
        return []

# ----------------- 6. DRIVER PARTNER ATTACHMENT -----------------
@app.post("/api/drivers")
def register_driver(driver: DriverRegister):
    if not supabase:
        return {"status": "mock_saved", "data": driver.dict()}
    try:
        res = supabase.table("driver_partners").insert(driver.dict()).execute()
        return {"status": "success", "message": "Cab registered for verification.", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/drivers")
def get_drivers():
    if not supabase:
        return []
    try:
        res = supabase.table("driver_partners").select("*").order("created_at", desc=True).limit(50).execute()
        return res.data or []
    except Exception as e:
        return []
