from fastapi import FastAPI, File, UploadFile ,HTTPException
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from PIL import Image
from io import BytesIO
import numpy as np
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pickle
from joblib import load
from pydantic import BaseModel
from utils.utils import get_crop_recommendation, get_fertilizer_recommendation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow specific origin (frontend)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# this is Recommendation models
crop_model = pickle.load(open('Models/RandomForest.pkl', 'rb'))
fertilizer_model = pickle.load(open('Models/fertilizer.pkl', 'rb'))
soil_label_encoder = joblib.load('Models/soil_label_encoder.joblib')
crop_label_encoder = joblib.load('Models/crop_label_encoder.joblib')
fertilizer_label_encoder = joblib.load('Models/fertilizer_encoder.joblib')

class CropInput(BaseModel):
    nitrogen:float
    phosphorus:float
    potassium:float
    temperature:float
    humidity:float
    ph:float
    rainfall:float  

class FertilizerInput(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    soil_type: str
    crop_type: str
    nitrogen: float
    potassium: float
    phosphorous: float

class CropResponse(BaseModel):
    recommended_crop:str
    
class FertilizerResponse(BaseModel):
    recommended_fertilizer:str

# this is cotton detection model
model = load_model("best_model.keras")  

class_names = [
    "Aphids", 
    "army_worm", 
    "bacterial_blight", 
    "cotton_boll_rot", 
    "green_cotton_boll",
    "healthy",  
    "powdery_mildew",
    "target_spot"
    
]

def preprocess_image(image_data: bytes) -> np.ndarray:
    img = Image.open(BytesIO(image_data)).convert("RGB")  
    img = img.resize((224, 224))  
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)  
    img_array = img_array / 255.0 
    return img_array


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        
        image_data = await file.read()
        
        
        img_array = preprocess_image(image_data)

        
        predictions = model.predict(img_array)
        predicted_class = class_names[np.argmax(predictions)]  
        confidence = np.max(predictions)  

        
        return JSONResponse({
            "predicted_class": predicted_class,
            "confidence": float(confidence)
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/crop_recommendation/", response_model=CropResponse)
async def crop_recommendation(data: CropInput):
    try:
        recommended_crop = get_crop_recommendation(data, crop_model)
        return CropResponse(recommended_crop=recommended_crop)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during crop recommendation: {str(e)}")

@app.post("/fertilizer_recommendation/", response_model=FertilizerResponse)
async def fertilizer_recommendation(data: FertilizerInput):
    try:
        recommended_fertilizer = get_fertilizer_recommendation(
            data, fertilizer_model, soil_label_encoder, crop_label_encoder, fertilizer_label_encoder
        )
        return FertilizerResponse(recommended_fertilizer=recommended_fertilizer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during fertilizer recommendation: {str(e)}")
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
