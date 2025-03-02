import nltk
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
import os 
from app.modules.interview.utils.fer import Model
import cv2
import dlib
from app.modules.interview.utils.valence_arousal import load_models
from dotenv import load_dotenv
# Download necessary NLTK packages
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger')
nltk.download('averaged_perceptron_tagger_eng')

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Set your API key
import google.generativeai as genai

genai.configure(api_key=GEMINI_API_KEY)

# Choose a Gemini model
gem_model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# Device setup
device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
models_folder=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'models')
fer_model_path=os.path.join(models_folder,'22.6_AffectNet_10K_part2.pt')
val_ar_feat_path=os.path.join(models_folder,'resnet_features.pt')
valence_arousal_model=os.path.join(models_folder,'emotion_model.pt')


# Load Whisper model and processor
model_id = "openai/whisper-small"
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
)
model.to(device)
processor = AutoProcessor.from_pretrained(model_id)
sentipipe = pipeline("text-classification", model="cardiffnlp/twitter-roberta-base-sentiment", device=device)




fer_model=Model(fps=30,fer_model=fer_model_path)
resnet,emotion_model=load_models(valence_arousal_model,val_ar_feat_path)

smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')


dnn_net = cv2.dnn.readNetFromCaffe(os.path.join(models_folder,'deploy.prototxt'), os.path.join(models_folder,"res10_300x300_ssd_iter_140000.caffemodel"))

predictor = dlib.shape_predictor(os.path.join(models_folder,'shape_predictor_68_face_landmarks.dat'))




models_dict={
    'asrmodel':model,
    'asrproc':processor,
    'sentipipe':sentipipe,
    'fer':fer_model,
    "valence_fer":(resnet,emotion_model),
    'smile_cascade':smile_cascade,
    'face':(dnn_net,predictor),
    'gem':gem_model,
}