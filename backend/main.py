from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from PIL import Image
from io import BytesIO
import numpy as np
import uvicorn
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow specific origin (frontend)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
